import * as pretestsRepository from './pretests.repository.js';
import { AppError } from '../../errors/AppError.js';
import { CODIGOS_ERROR } from '../../constants/codigosError.js';

async function obtenerPretestExistente(id) {
  const pretest = await pretestsRepository.buscarPretestPorId(id);
  if (!pretest) {
    throw new AppError('El registro de pre-test solicitado no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }
  return pretest;
}

export const listarPretests = () => pretestsRepository.listarPretests();

export const obtenerPretest = (id) => obtenerPretestExistente(id);

export const crearPretest = (datos) => pretestsRepository.crearPretest(datos);

export async function actualizarPretest(id, datos) {
  await obtenerPretestExistente(id);
  return pretestsRepository.actualizarPretest(id, datos);
}

export async function eliminarPretest(id) {
  await obtenerPretestExistente(id);
  return pretestsRepository.eliminarPretest(id);
}
