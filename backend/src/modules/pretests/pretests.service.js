import * as pretestsRepo from './pretests.repository.js';

export const getPretests = async () => {
  return await pretestsRepo.obtenerTodosPretests();
};

export const createPretest = async (datos) => {
  if (!datos.nombre_participante) throw new Error('El nombre es obligatorio');
  return await pretestsRepo.crearPretestBD(datos);
};

export const updatePretest = async (id, datos) => {
  return await pretestsRepo.actualizarPretestBD(id, datos);
};

export const deletePretest = async (id) => {
  return await pretestsRepo.eliminarPretestBD(id);
};