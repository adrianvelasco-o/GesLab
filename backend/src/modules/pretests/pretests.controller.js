import * as pretestsService from './pretests.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

export async function listar(_req, res, next) {
  try {
    return responderExito(res, 200, 'Registros de pre-test obtenidos correctamente', await pretestsService.listarPretests());
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    return responderExito(res, 200, 'Pre-test obtenido correctamente', await pretestsService.obtenerPretest(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    return responderExito(res, 201, 'Pre-test registrado exitosamente', await pretestsService.crearPretest(req.body));
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const pretest = await pretestsService.actualizarPretest(req.params.id, req.body);
    return responderExito(res, 200, 'Pre-test actualizado correctamente', pretest);
  } catch (error) {
    next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    await pretestsService.eliminarPretest(req.params.id);
    return responderExito(res, 200, 'Pre-test eliminado correctamente', null);
  } catch (error) {
    next(error);
  }
}
