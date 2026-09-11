import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
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

// 1. Cabeceras de seguridad con Helmet (CSP deshabilitado para permitir el panel HTML interactivo)
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// 2. Configuración de CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

// 3. Limitador de peticiones para Login
const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Aumentado para pruebas locales
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    exito: false,
    mensaje: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.',
    error: {
      codigo: CODIGOS_ERROR.ACCESO_DENEGADO
    }
  }
});

app.use('/api/auth/login', limitadorLogin);
app.use('/api/autenticacion/login', limitadorLogin);

// 4. Logging de peticiones HTTP
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