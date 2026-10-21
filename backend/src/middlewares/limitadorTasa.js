import rateLimit from 'express-rate-limit';
import { CODIGOS_ERROR } from '../constants/codigosError.js';

/**
 * Middleware para limitar intentos repetidos de autenticación (fuerza bruta / credential stuffing).
 */
export const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: process.env.NODE_ENV === 'test' ? 100 : 15, // 15 intentos máximos en entornos reales
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    exito: false,
    mensaje: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.',
    error: {
      codigo: CODIGOS_ERROR.ACCESO_DENEGADO
    }
  }
});

/**
 * Limita la creación de cuentas por IP (evita registro masivo automatizado).
 */
export const limitadorRegistro = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: process.env.NODE_ENV === 'test' ? 100 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    exito: false,
    mensaje: 'Demasiados registros desde esta red. Intente nuevamente más tarde.',
    error: {
      codigo: CODIGOS_ERROR.ACCESO_DENEGADO
    }
  }
});
