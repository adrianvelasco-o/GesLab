import { AppError } from '../errors/AppError.js';
import { CODIGOS_ERROR } from '../constants/codigosError.js';
import { responderError } from '../utils/respuestaApi.js';

/**
 * Middleware centralizado de manejo de errores en Express.
 */
export function manejadorErrores(err, req, res, _next) {
  // 1. Error operacional conocido (AppError)
  if (err instanceof AppError) {
    return responderError(res, err.codigoHttp, err.message, err.codigoError, err.detalles);
  }

  // 2. Errores de sintaxis JSON en el body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return responderError(res, 400, 'Formato JSON inválido en la petición', CODIGOS_ERROR.DATOS_INVALIDOS);
  }

  // 3. Errores de Prisma ORM
  if (err.code === 'P2002') {
    const camposAfectados = err.meta?.target || [];
    return responderError(
      res,
      409,
      'Conflicto de unicidad en la base de datos',
      CODIGOS_ERROR.CONFLICTO_DUPLICADO,
      { campos: camposAfectados }
    );
  }

  if (err.code === 'P2025') {
    return responderError(
      res,
      404,
      'El registro solicitado no existe en la base de datos',
      CODIGOS_ERROR.RECURSO_NO_ENCONTRADO
    );
  }

  // 4. Errores no controlados (Errores internos de servidor 500)
  console.error('Error no controlado:', err);
  return responderError(
    res,
    500,
    'Ocurrió un error interno en el servidor',
    CODIGOS_ERROR.ERROR_INTERNO_SERVIDOR,
    process.env.NODE_ENV === 'development' ? { mensajeOriginal: err.message, stack: err.stack } : null
  );
}
