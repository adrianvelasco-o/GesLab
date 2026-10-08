import * as notificacionesService from './notificaciones.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

export async function listar(req, res, next) {
  try {
    const { page, limit } = req.query;
    const resultado = await notificacionesService.obtenerNotificacionesUsuario(req.usuario.id, page, limit);
    return responderExito(res, 200, 'Notificaciones obtenidas correctamente', resultado);
  } catch (error) {
    next(error);
  }
}

export async function obtenerNoLeidas(req, res, next) {
  try {
    const conteo = await notificacionesService.obtenerConteoNoLeidas(req.usuario.id);
    return responderExito(res, 200, 'Conteo de notificaciones no leídas obtenido', conteo);
  } catch (error) {
    next(error);
  }
}

export async function marcarLeida(req, res, next) {
  try {
    const notificacionId = parseInt(req.params.id, 10);
    const notificacionActualizada = await notificacionesService.marcarNotificacionLeida(notificacionId, req.usuario.id);
    return responderExito(res, 200, 'Notificación marcada como leída', notificacionActualizada);
  } catch (error) {
    next(error);
  }
}

export async function marcarTodasLeidas(req, res, next) {
  try {
    await notificacionesService.marcarTodasNotificacionesLeidas(req.usuario.id);
    return responderExito(res, 200, 'Todas las notificaciones fueron marcadas como leídas');
  } catch (error) {
    next(error);
  }
}

export async function registrarDispositivo(req, res, next) {
  try {
    const dispositivo = await notificacionesService.registrarDispositivoUsuario(req.usuario.id, req.body);
    return responderExito(res, 201, 'Token de dispositivo FCM registrado correctamente', dispositivo);
  } catch (error) {
    next(error);
  }
}

export async function eliminarDispositivo(req, res, next) {
  try {
    const { token } = req.params;
    await notificacionesService.eliminarDispositivoUsuario(req.usuario.id, token);
    return responderExito(res, 200, 'Dispositivo eliminado correctamente');
  } catch (error) {
    next(error);
  }
}
