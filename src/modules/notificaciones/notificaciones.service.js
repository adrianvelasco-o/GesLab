import * as notificacionesRepository from './notificaciones.repository.js';
import { enviarPushAUsuario } from '../../utils/firebasePush.js';
import { AppError } from '../../errors/AppError.js';
import { CODIGOS_ERROR } from '../../constants/codigosError.js';

/**
 * Registra una notificación en la base de datos PostgreSQL (fuente de verdad)
 * e intenta entregar la notificación push vía FCM a los dispositivos activos del usuario.
 *
 * @param {Object} params
 * @param {number} params.usuarioId ID del usuario destinatario
 * @param {string} params.titulo Título descriptivo de la notificación
 * @param {string} params.mensaje Contenido explicativo
 * @param {string} params.tipo Enum TipoNotificacion (PRACTICA_ENVIADA_REVISION, PRACTICA_APROBADA, etc.)
 * @param {string} [params.referenciaEntidad] Nombre del modelo ('PRACTICA', 'RESERVA')
 * @param {number|string} [params.referenciaId] ID del recurso relacionado
 */
export async function crearYEnviarNotificacion({ usuarioId, titulo, mensaje, tipo, referenciaEntidad, referenciaId }) {
  if (!usuarioId) {
    console.warn('Intento de crear notificación sin usuarioId omitido.');
    return null;
  }

  // 1. Guardar la notificación en PostgreSQL (Fuente de verdad)
  let notificacionGuardada;
  try {
    notificacionGuardada = await notificacionesRepository.crearNotificacion({
      usuarioId,
      titulo,
      mensaje,
      tipo,
      referenciaEntidad,
      referenciaId
    });
  } catch (errorDb) {
    console.error('Error al persistir notificación en PostgreSQL:', errorDb.message);
    throw errorDb;
  }

  // 2. Intentar entregar notificación push vía Firebase FCM (asíncrono y resiliente)
  try {
    const tokens = await notificacionesRepository.obtenerTokensActivosPorUsuario(usuarioId);

    if (tokens && tokens.length > 0) {
      const resultadoPush = await enviarPushAUsuario({
        tokens,
        titulo,
        mensaje,
        datosExtra: {
          tipo,
          referenciaEntidad: referenciaEntidad ? String(referenciaEntidad) : '',
          referenciaId: referenciaId ? String(referenciaId) : '',
          notificacionId: String(notificacionGuardada.id)
        }
      });

      // 3. Si FCM detectó tokens expirados o inválidos, limpiarlos de la BD
      if (resultadoPush.tokensInvalidos && resultadoPush.tokensInvalidos.length > 0) {
        for (const tokenInvalido of resultadoPush.tokensInvalidos) {
          await notificacionesRepository.desactivarOEliminarToken(tokenInvalido);
        }
      }
    }
  } catch (errorFcm) {
    // Si la entrega por FCM falla, la notificación PERMANECE en la BD.
    console.warn('AVISO: La entrega de la notificación Push FCM falló, pero la notificación fue guardada en BD:', errorFcm.message);
  }

  return notificacionGuardada;
}

export async function obtenerNotificacionesUsuario(usuarioId, page = 1, limit = 20) {
  const p = parseInt(page, 10) || 1;
  const l = parseInt(limit, 10) || 20;
  return notificacionesRepository.listarNotificacionesPorUsuario(usuarioId, { page: p, limit: l });
}

export async function obtenerConteoNoLeidas(usuarioId) {
  const total = await notificacionesRepository.contarNotificacionesNoLeidas(usuarioId);
  return { total };
}

export async function marcarNotificacionLeida(id, usuarioId) {
  const notificacion = await notificacionesRepository.buscarNotificacionPorId(id);

  if (!notificacion) {
    throw new AppError('La notificación solicitada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  if (notificacion.usuarioId !== usuarioId) {
    throw new AppError('No tienes permiso para modificar esta notificación', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return notificacionesRepository.marcarNotificacionLeida(id);
}

export async function marcarTodasNotificacionesLeidas(usuarioId) {
  return notificacionesRepository.marcarTodasNotificacionesLeidas(usuarioId);
}

export async function registrarDispositivoUsuario(usuarioId, datos) {
  return notificacionesRepository.registrarOActualizarDispositivo({
    usuarioId,
    tokenFirebase: datos.tokenFirebase,
    tipoDispositivo: datos.tipoDispositivo
  });
}

export async function eliminarDispositivoUsuario(usuarioId, tokenFirebase) {
  return notificacionesRepository.eliminarDispositivoPorTokenYUsuario(tokenFirebase, usuarioId);
}
