import admin from 'firebase-admin';
import { CONFIG } from '../config/ambiente.js';

const firebaseAdmin = admin?.default || admin;

let firebaseInicializado = false;

try {
  const apps = firebaseAdmin.apps || [];
  if (apps.length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID || CONFIG.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || CONFIG.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || CONFIG.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKeyRaw) {
      const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
      firebaseInicializado = true;
      console.log('Firebase Admin SDK inicializado exitosamente mediante variables de entorno.');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(serviceAccount)
        });
        firebaseInicializado = true;
        console.log('Firebase Admin SDK inicializado exitosamente desde FIREBASE_SERVICE_ACCOUNT JSON.');
      } catch (e) {
        console.warn('ADVERTENCIA: FIREBASE_SERVICE_ACCOUNT contiene un JSON inválido.');
      }
    } else {
      console.warn('AVISO: Firebase Admin SDK no inicializado. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY en su archivo .env para habilitar Push Notifications nativas.');
    }
  } else {
    firebaseInicializado = true;
  }
} catch (error) {
  console.error('Error al intentar inicializar Firebase Admin SDK:', error.message);
}

/**
 * Envia notificaciones push mediante Firebase Multicast a una lista de tokens de dispositivos.
 *
 * @param {Object} opciones
 * @param {string[]} opciones.tokens Tokens FCM de los dispositivos destino
 * @param {string} opciones.titulo Título de la notificación push
 * @param {string} opciones.mensaje Cuerpo o contenido del mensaje
 * @param {Object} [opciones.datosExtra] Metadatos como strings (tipo, referenciaEntidad, referenciaId, etc.)
 * @returns {Promise<{ exitos: number, fallos: number, tokensInvalidos: string[] }>}
 */
export async function enviarPushAUsuario({ tokens = [], titulo, mensaje, datosExtra = {} }) {
  const resultado = { exitos: 0, fallos: 0, tokensInvalidos: [] };

  if (!firebaseInicializado) {
    console.warn('AVISO: Intento de envío Push omitido por falta de configuración de Firebase Admin SDK.');
    return resultado;
  }

  if (!tokens || tokens.length === 0) {
    return resultado;
  }

  // Asegurar que todos los valores en 'data' sean de tipo String exigido por FCM
  const dataPayload = {};
  Object.keys(datosExtra).forEach((key) => {
    if (datosExtra[key] !== undefined && datosExtra[key] !== null) {
      dataPayload[key] = String(datosExtra[key]);
    }
  });

  const messagePayload = {
    notification: {
      title: titulo,
      body: mensaje
    },
    data: dataPayload,
    tokens: tokens
  };

  try {
    const response = await firebaseAdmin.messaging().sendEachForMulticast(messagePayload);
    resultado.exitos = response.successCount;
    resultado.fallos = response.failureCount;

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          const tokenFallido = tokens[idx];
          console.warn(`Error al entregar Push FCM al token ${tokenFallido.substring(0, 15)}... Error: ${errorCode}`);

          // Identificar tokens caducados o no registrados
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            resultado.tokensInvalidos.push(tokenFallido);
          }
        }
      });
    }

    console.log(`Push FCM procesado: ${resultado.exitos} entregados exitosamente, ${resultado.fallos} fallos.`);
    return resultado;
  } catch (error) {
    console.error('Error al invocar sendEachForMulticast de Firebase:', error.message);
    return resultado;
  }
}
