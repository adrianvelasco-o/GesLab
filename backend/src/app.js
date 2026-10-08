import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config/ambiente.js';
import rutasApi from './routes/index.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { responderError } from './utils/respuestaApi.js';
import { CODIGOS_ERROR } from './constants/codigosError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración para proxy inverso (Nginx, Render, etc.)
app.set('trust proxy', 1);

// 1. Cabeceras de seguridad con Helmet y Content Security Policy (CSP) robusto
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:
          CONFIG.NODE_ENV === 'production'
            ? ["'self'"]
            : ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: CONFIG.NODE_ENV === 'production' ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// 2. Configuración segura de CORS basada en lista blanca y soporte para credenciales
const origenesPermitidos = Array.isArray(CONFIG.CORS_ORIGEN) ? CONFIG.CORS_ORIGEN : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (móviles nativas, curl, supertest, etc.)
      if (!origin) return callback(null, true);

      // Verificar contra la lista blanca o localhost en entornos de desarrollo/test
      const esPermitido =
        origenesPermitidos.includes(origin) ||
        (CONFIG.NODE_ENV !== 'production' &&
          (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')));

      if (esPermitido) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['ratelimit-limit', 'ratelimit-remaining']
  })
);

// 3. Logging de peticiones HTTP
if (CONFIG.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 5. Parsers de peticiones
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Servir archivos estáticos del panel de pruebas HTML
app.use(express.static(path.join(__dirname, '../public')));

// 7. Montar Rutas Principales de la API
app.use('/api', rutasApi);

// 8. Manejo de Ruta No Encontrada (404)
app.use((_req, res) => {
  return responderError(res, 404, 'La ruta solicitada no existe', CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
});

// 9. Middleware Centralizado de Errores
app.use(manejadorErrores);

export default app;