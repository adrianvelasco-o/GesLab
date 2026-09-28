import * as tareasRepo from './tareas.repository.js';

export const getTareas = async () => {
  return await tareasRepo.obtenerTodasLasTareas();
};

export const createTarea = async (datos) => {
  if (!datos.titulo) throw new Error('El título es obligatorio');
  return await tareasRepo.crearTareaBD(datos);
};

export const updateTarea = async (id, datos) => {
  return await tareasRepo.actualizarTareaBD(id, datos);
};

export const deleteTarea = async (id) => {
  return await tareasRepo.eliminarTareaBD(id);
};