import * as reservasRepository from './reservas.repository.js';
import * as practicasRepository from '../practicas/practicas.repository.js';
import { crearYEnviarNotificacion } from '../notificaciones/notificaciones.service.js';
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

  const reservaAprobada = await reservasRepository.actualizarEstadoReserva(reservaId, {
    estado: 'APROBADA',
    revisorId: usuario.id,
    motivoRechazoCancelacion: null
  });

  // Notificar al estudiante solicitante
  crearYEnviarNotificacion({
    usuarioId: reserva.solicitanteId,
    titulo: 'Reserva de Laboratorio Aprobada',
    mensaje: `Tu solicitud de reserva de laboratorio para la práctica ID ${reserva.practicaId} ha sido aprobada.`,
    tipo: 'RESERVA_APROBADA',
    referenciaEntidad: 'RESERVA',
    referenciaId: reservaId
  }).catch((err) => console.error('Error al notificar aprobación de reserva:', err.message));

  return reservaAprobada;
}

export async function rechazarReserva(reservaId, motivo, usuario) {
  const reserva = await reservasRepository.buscarReservaPorId(reservaId);
  if (!reserva) {
    throw new AppError('La reserva a rechazar no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  const reservaRechazada = await reservasRepository.actualizarEstadoReserva(reservaId, {
    estado: 'RECHAZADA',
    revisorId: usuario.id,
    motivoRechazoCancelacion: motivo
  });

  // Notificar al estudiante solicitante
  crearYEnviarNotificacion({
    usuarioId: reserva.solicitanteId,
    titulo: 'Reserva de Laboratorio Rechazada',
    mensaje: `Tu solicitud de reserva ha sido rechazada. Motivo: ${motivo}`,
    tipo: 'RESERVA_RECHAZADA',
    referenciaEntidad: 'RESERVA',
    referenciaId: reservaId
  }).catch((err) => console.error('Error al notificar rechazo de reserva:', err.message));

  return reservaRechazada;
}

export async function listarLaboratoriosDisponibles() {
  return reservasRepository.listarLaboratoriosConHorarios();
}

export async function crearNuevoLaboratorio(datos) {
  return reservasRepository.crearLaboratorio({
    nombre: datos.nombre,
    ubicacion: datos.ubicacion,
    capacidad: datos.capacidad || 1,
    descripcion: datos.descripcion || null
  });
}

export async function crearHorarioLaboratorio(laboratorioId, datos) {
  const laboratorio = await reservasRepository.buscarLaboratorioPorId(laboratorioId);
  if (!laboratorio) {
    throw new AppError('El laboratorio especificado no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // Parsear la cadena HH:MM a un objeto Date (tipo TIME en Postgres Prisma)
  const [hIni, mIni] = datos.horaInicio.split(':').map(Number);
  const [hFin, mFin] = datos.horaFin.split(':').map(Number);

  const horaInicioDate = new Date(1970, 0, 1, hIni, mIni, 0);
  const horaFinDate = new Date(1970, 0, 1, hFin, mFin, 0);

  if (horaInicioDate >= horaFinDate) {
    throw new AppError('La hora de inicio debe ser anterior a la hora de fin', 400, CODIGOS_ERROR.DATOS_INVALIDOS);
  }

  return reservasRepository.crearHorario({
    laboratorioId,
    diaSemana: datos.diaSemana,
    horaInicio: horaInicioDate,
    horaFin: horaFinDate
  });
}

