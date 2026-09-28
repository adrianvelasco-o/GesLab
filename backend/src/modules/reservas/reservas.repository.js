import { prisma } from '../../config/prisma.js';

export async function crearReserva(datosReserva) {
  return prisma.reserva.create({
    data: datosReserva,
    include: {
      practica: true,
      laboratorio: true,
      horario: true,
      solicitante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      }
    }
  });
}

export async function listarReservasPorUsuario(solicitanteId) {
  return prisma.reserva.findMany({
    where: { solicitanteId },
    include: {
      practica: true,
      laboratorio: true,
      horario: true,
      solicitante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      }
    },
    orderBy: { creadoEn: 'desc' }
  });
}

export async function listarTodasLasReservas() {
  return prisma.reserva.findMany({
    include: {
      practica: true,
      laboratorio: true,
      horario: true,
      solicitante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      }
    },
    orderBy: { creadoEn: 'desc' }
  });
}

export async function buscarReservaPorId(id) {
  return prisma.reserva.findUnique({
    where: { id },
    include: {
      practica: true,
      laboratorio: true,
      horario: true,
      solicitante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      }
    }
  });
}

export async function actualizarEstadoReserva(id, { estado, revisorId, motivoRechazoCancelacion }) {
  return prisma.reserva.update({
    where: { id },
    data: {
      estado,
      revisorId,
      motivoRechazoCancelacion
    },
    include: {
      practica: true,
      laboratorio: true,
      horario: true,
      solicitante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      }
    }
  });
}

export async function listarLaboratoriosConHorarios() {
  return prisma.laboratorio.findMany({
    where: { activo: true },
    include: {
      horarios: {
        where: { activo: true },
        orderBy: { horaInicio: 'asc' }
      }
    }
  });
}

//Obtiene las reservas ocupadas (PENDIENTE o APROBADA) para una fecha específica

export async function obtenerReservasPorFecha(fechaReserva) {
  return prisma.reserva.findMany({
    where: {
      fechaReserva: fechaReserva,
      estado: {
        in: ['PENDIENTE', 'APROBADA'] // Ocupan espacio en el laboratorio
      }
    },
    select: {
      id: true,
      laboratorioId: true,
      horarioId: true,
      estado: true
    }
  });
}

export async function buscarReservaExistente({ laboratorioId, horarioId, fechaReserva }) {
  return prisma.reserva.findFirst({
    where: {
      laboratorioId,
      horarioId,
      fechaReserva,
      estado: {
        in: ['PENDIENTE', 'APROBADA']
      }
    }
  });
}
