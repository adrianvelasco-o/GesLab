import * as tareasRepository from './tareas.repository.js';
import { AppError } from '../../errors/AppError.js';
import { CODIGOS_ERROR } from '../../constants/codigosError.js';

async function obtenerTareaExistente(id) {
  const tarea = await tareasRepository.buscarTareaPorId(id);
  if (!tarea) {
    throw new AppError('La tarea solicitada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }
  return tarea;
}

export const listarTareas = () => tareasRepository.listarTareas();

export const obtenerTarea = (id) => obtenerTareaExistente(id);

export const crearTarea = (datos) => tareasRepository.crearTarea(datos);

export async function actualizarTarea(id, datos) {
  await obtenerTareaExistente(id);
  return tareasRepository.actualizarTarea(id, datos);
}

export async function eliminarTarea(id) {
  await obtenerTareaExistente(id);
  return tareasRepository.eliminarTarea(id);
}
