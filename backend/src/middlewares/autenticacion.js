import { verificarTokenJwt } from '../utils/tokenJwt.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';
import { CODIGOS_ERROR } from '../constants/codigosError.js';

/**
 * Middleware para autenticar usuarios mediante JWT y verificar su estado activo.
 */
export async function autenticar(req, _res, next) {
  try {
    const cabeceraAutorizacion = req.headers.authorization;

    if (!cabeceraAutorizacion || !cabeceraAutorizacion.startsWith('Bearer ')) {
      throw new AppError('Token de autenticación no proporcionado', 401, CODIGOS_ERROR.TOKEN_NO_PROPORCIONADO);
    }

    const token = cabeceraAutorizacion.split(' ')[1];
    let tokenDecodificado;

    try {
      tokenDecodificado = verificarTokenJwt(token);
    } catch (_error) {
      throw new AppError('El token proporcionado es inválido o ha expirado', 401, CODIGOS_ERROR.TOKEN_INVALIDO);
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: tokenDecodificado.usuarioId },
      include: { rol: true }
    });

    if (!usuario) {
      throw new AppError('El usuario asociado al token ya no existe', 401, CODIGOS_ERROR.CREDENCIALES_INVALIDAS);
    }

    if (!usuario.activo) {
      throw new AppError('La cuenta de usuario se encuentra inactiva', 403, CODIGOS_ERROR.USUARIO_INACTIVO);
    }

    req.usuario = {
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      correoInstitucional: usuario.correoInstitucional,
      rolId: usuario.rolId,
      rolNombre: usuario.rol.nombre
    };

    next();
  } catch (error) {
    next(error);
  }
}
