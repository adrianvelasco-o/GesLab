import * as authService from './auth.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

export async function register(req, res, next) {
  try {
    const resultado = await authService.registrarUsuario(req.body);
    return responderExito(res, 201, 'Usuario registrado exitosamente', resultado);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { correoInstitucional, contrasena } = req.body;
    const resultado = await authService.iniciarSesion(correoInstitucional, contrasena);
    return responderExito(res, 200, 'Inicio de sesión exitoso', resultado);
  } catch (error) {
    next(error);
  }
}

export async function obtenerMiPerfil(req, res, next) {
  try {
    const usuarioPerfil = await authService.obtenerPerfil(req.usuario.id);
    return responderExito(res, 200, 'Información del usuario obtenida correctamente', usuarioPerfil);
  } catch (error) {
    next(error);
  }
}
