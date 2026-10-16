import * as tareasService from './tareas.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

export async function listar(_req, res, next) {
  try {
    return responderExito(res, 200, 'Tareas obtenidas correctamente', await tareasService.listarTareas());
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    return responderExito(res, 200, 'Tarea obtenida correctamente', await tareasService.obtenerTarea(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    return responderExito(res, 201, 'Tarea registrada exitosamente', await tareasService.crearTarea(req.body));
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const tarea = await tareasService.actualizarTarea(req.params.id, req.body);
    return responderExito(res, 200, 'Tarea actualizada correctamente', tarea);
  } catch (error) {
    next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    await tareasService.eliminarTarea(req.params.id);
    return responderExito(res, 200, 'Tarea eliminada correctamente', null);
  } catch (error) {
    next(error);
  }
}
