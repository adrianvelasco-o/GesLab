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
