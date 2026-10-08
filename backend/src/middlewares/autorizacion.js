import { AppError } from '../errors/AppError.js';
import { CODIGOS_ERROR } from '../constants/codigosError.js';

/**
 * Middleware de autorización RBAC por roles permitidos.
 * @param  {...string} rolesPermitidos Lista de roles autorizados para acceder a la ruta.
 */
export function permitirRoles(...rolesPermitidos) {
  return (req, _res, next) => {
    if (!req.usuario) {
      return next(new AppError('Usuario no autenticado', 401, CODIGOS_ERROR.TOKEN_NO_PROPORCIONADO));
    }

    if (!rolesPermitidos.includes(req.usuario.rolNombre)) {
      return next(
        new AppError(
          `Acceso denegado: Su rol '${req.usuario.rolNombre}' no tiene permisos para realizar esta acción`,
          403,
          CODIGOS_ERROR.ACCESO_DENEGADO
        )
      );
    }

    next();
  };
}
