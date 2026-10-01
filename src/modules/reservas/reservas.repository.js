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

export async function buscarLaboratorioPorId(id) {
  return prisma.laboratorio.findUnique({
    where: { id },
    include: { horarios: true }
  });
}

export async function crearLaboratorio(datos) {
  return prisma.laboratorio.create({
    data: datos
  });
}

export async function crearHorario(datos) {
  return prisma.horario.create({
    data: datos
  });
}

export async function listarReservasPorFecha(fecha) {
  const [year, month, day] = fecha.split('-').map(Number);
  const fechaInicio = new Date(Date.UTC(year, month - 1, day));
  const fechaFin = new Date(Date.UTC(year, month - 1, day + 1));

  return prisma.reserva.findMany({
    where: {
      fechaReserva: {
        gte: fechaInicio,
        lt: fechaFin
      },
      estado: {
        in: ['PENDIENTE', 'APROBADA']
      }
    }
  });
}

export async function buscarHorarioPorId(id) {
  return prisma.horario.findUnique({
    where: { id }
  });
}

export async function contarReservasActivasEnFranja({ laboratorioId, horarioId, fechaInicio, fechaFin }) {
  return prisma.reserva.count({
    where: {
      laboratorioId,
      horarioId,
      fechaReserva: {
        gte: fechaInicio,
        lt: fechaFin
      },
      estado: {
        in: ['PENDIENTE', 'APROBADA']
      }
    }
  });
}

export async function listarEncargadosActivos() {
  return prisma.usuario.findMany({
    where: {
      rol: { nombre: 'ENCARGADO' },
      activo: true
    },
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      correoInstitucional: true
    }
  });
}



