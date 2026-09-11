import { AppError } from '../errors/AppError.js';
import { CODIGOS_ERROR } from '../constants/codigosError.js';

/**
 * Middleware para validar datos de entrada mediante un esquema Zod.
 * @param {import('zod').ZodSchema} esquema
 * @param {'body' | 'params' | 'query'} origen
 */
export function validarEsquema(esquema, origen = 'body') {
  return (req, _res, next) => {
    const resultado = esquema.safeParse(req[origen]);

    if (!resultado.success) {
      const erroresFormateados = resultado.error.errors.map((item) => ({
        campo: item.path.join('.'),
        mensaje: item.message
      }));

      throw new AppError(
        'Los datos proporcionados son inválidos',
        400,
        CODIGOS_ERROR.DATOS_INVALIDOS,
        erroresFormateados
      );
    }

    req[origen] = resultado.data;
    next();
  };
}
