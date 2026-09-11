import * as reservasRepository from './reservas.repository.js';
import * as practicasRepository from '../practicas/practicas.repository.js';
import { AppError } from '../../errors/AppError.js';
import { CODIGOS_ERROR } from '../../constants/codigosError.js';

export async function solicitarReserva({ practicaId, laboratorioId = 1, horarioId = 1, fechaReserva, usuario }) {
  // 1. Verificar que la práctica exista
  const practica = await practicasRepository.buscarPracticaPorId(practicaId);
  if (!practica) {
    throw new AppError('La práctica especificada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // 2. Verificar que el estudiante sea el dueño de la práctica (o admin)
  if (practica.estudianteId !== usuario.id && !['ADMINISTRADOR', 'ENCARGADO'].includes(usuario.rolNombre)) {
    throw new AppError('Solo puedes solicitar reservas para tus propias prácticas', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  // 3. Crear la reserva en estado PENDIENTE
  return reservasRepository.crearReserva({
    practicaId,
    laboratorioId,
    horarioId,
    solicitanteId: usuario.id,
    fechaReserva: new Date(fechaReserva),
    estado: 'PENDIENTE'
  });
}

// Alias para compatibilidad
export const solicitarNuevaReserva = solicitarReserva;

export async function obtenerReservasUsuario(usuario) {
  // Administradores y encargados pueden consultar todas las solicitudes
  if (['ADMINISTRADOR', 'ENCARGADO'].includes(usuario.rolNombre)) {
    return reservasRepository.listarTodasLasReservas();
  }
  return reservasRepository.listarReservasPorUsuario(usuario.id);
}

export async function obtenerDetalleReserva(reservaId, usuario) {
  const reserva = await reservasRepository.buscarReservaPorId(reservaId);
  if (!reserva) {
    throw new AppError('La reserva solicitada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  const tienePermiso =
    ['ADMINISTRADOR', 'ENCARGADO'].includes(usuario.rolNombre) ||
    reserva.solicitanteId === usuario.id;

  if (!tienePermiso) {
    throw new AppError('No tienes permiso para consultar esta reserva', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return reserva;
}

export async function aprobarReserva(reservaId, usuario) {
  const reserva = await reservasRepository.buscarReservaPorId(reservaId);
  if (!reserva) {
    throw new AppError('La reserva a aprobar no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // Regla de negocio: Un estudiante no puede aprobar sus propias reservas
  if (reserva.solicitanteId === usuario.id && usuario.rolNombre !== 'ADMINISTRADOR') {
    throw new AppError('Un estudiante no puede aprobar su propia solicitud de reserva', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return reservasRepository.actualizarEstadoReserva(reservaId, {
    estado: 'APROBADA',
    revisorId: usuario.id,
    motivoRechazoCancelacion: null
  });
}

export async function rechazarReserva(reservaId, motivo, usuario) {
  const reserva = await reservasRepository.buscarReservaPorId(reservaId);
  if (!reserva) {
    throw new AppError('La reserva a rechazar no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  return reservasRepository.actualizarEstadoReserva(reservaId, {
    estado: 'RECHAZADA',
    revisorId: usuario.id,
    motivoRechazoCancelacion: motivo
  });
}

export async function listarLaboratoriosDisponibles() {
  return reservasRepository.listarLaboratoriosConHorarios();
}
