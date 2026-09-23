import { prisma } from '../../config/prisma.js';

export async function crearPractica(datosPractica) {
  return prisma.practica.create({
    data: datosPractica,
    include: {
      estudiante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      }
    }
  });
}

export async function actualizarPractica(id, datos) {
  return prisma.practica.update({
    where: { id },
    data: datos,
    include: {
      estudiante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      },
      instrumentos: true,
      documentos: true
    }
  });
}

export async function listarPracticasPorEstudiante(estudianteId) {
  return prisma.practica.findMany({
    where: { estudianteId, eliminadoEn: null },
    include: {
      instrumentos: true,
      documentos: true,
      reservas: true,
      revisiones: {
        include: { observaciones: true },
        orderBy: { creadoEn: 'desc' }
      }
    },
    orderBy: { creadoEn: 'desc' }
  });
}

export async function listarTodasLasPracticas() {
  return prisma.practica.findMany({
    where: { eliminadoEn: null },
    include: {
      estudiante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      },
      instrumentos: true,
      documentos: true,
      reservas: true,
      revisiones: {
        include: { observaciones: true },
        orderBy: { creadoEn: 'desc' }
      }
    },
    orderBy: { creadoEn: 'desc' }
  });
}

export async function buscarPracticaPorId(id) {
  return prisma.practica.findUnique({
    where: { id },
    include: {
      estudiante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      },
      docente: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      },
      instrumentos: true,
      documentos: true,
      reservas: true,
      revisiones: {
        include: { observaciones: true, docente: { select: { id: true, nombres: true, apellidos: true } } },
        orderBy: { creadoEn: 'desc' }
      }
    }
  });
}

// -------------------------------------------------------------
// INSTRUMENTOS DE EVALUACIÓN
// -------------------------------------------------------------

export async function crearInstrumento(datos) {
  return prisma.instrumento.create({
    data: datos
  });
}

export async function listarInstrumentosPorPractica(practicaId) {
  return prisma.instrumento.findMany({
    where: { practicaId },
    orderBy: { creadoEn: 'asc' }
  });
}

export async function buscarInstrumentoPorId(id) {
  return prisma.instrumento.findUnique({
    where: { id }
  });
}

export async function eliminarInstrumento(id) {
  return prisma.instrumento.delete({
    where: { id }
  });
}

// -------------------------------------------------------------
// REVISIONES DOCENTES Y OBSERVACIONES
// -------------------------------------------------------------

export async function crearRevisionConObservaciones({ practicaId, docenteId, resultado, comentariosGenerales, observaciones = [] }) {
  return prisma.$transaction(async (tx) => {
    // 1. Crear el registro de revisión
    const revision = await tx.revision.create({
      data: {
        practicaId,
        docenteId,
        resultado,
        comentariosGenerales,
        observaciones: {
          create: observaciones.map((obs) => ({
            seccion: obs.seccion,
            detalle: obs.detalle,
            resuelta: false
          }))
        }
      },
      include: {
        observaciones: true
      }
    });

    // 2. Actualizar el estado de la práctica según el resultado
    const nuevoEstado = resultado === 'APROBADA' ? 'APROBADA' : 'RECHAZADA';
    await tx.practica.update({
      where: { id: practicaId },
      data: { estado: nuevoEstado }
    });

    return revision;
  });
}

/**
 * Cambia el estado de una práctica a CERRADA (Cierre formal docente)
 */
export async function cerrarPractica(id) {
  return prisma.practica.update({
    where: { id },
    data: { estado: 'CERRADA' },
    include: {
      estudiante: {
        select: { id: true, nombres: true, apellidos: true, correoInstitucional: true }
      },
      documentos: true
    }
  });
}

export async function listarRevisionesPorPractica(practicaId) {
  return prisma.revision.findMany({
    where: { practicaId },
    include: {
      observaciones: true,
      docente: {
        select: { id: true, nombres: true, apellidos: true }
      }
    },
    orderBy: { creadoEn: 'desc' }
  });
}

// -------------------------------------------------------------
// OBSERVACIONES Y VALIDACIONES
// -------------------------------------------------------------

/**
 * Cuenta cuántas observaciones pendientes (resuelta = false) existen 
 * en todas las revisiones asociadas a una práctica.
 */
export async function contarObservacionesPendientes(practicaId) {
  return prisma.observacion.count({
    where: {
      revision: {
        practicaId: practicaId
      },
      resuelta: false
    }
  });
}

/**
 * Busca una observación individual por su ID, incluyendo la revisión y práctica
 * para validar pertenencia y permisos en el servicio.
 */
export async function buscarObservacionPorId(id) {
  return prisma.observacion.findUnique({
    where: { id },
    include: {
      revision: {
        select: {
          practicaId: true
        }
      }
    }
  });
}

/**
 * Actualiza el estado 'resuelta' de una observación.
 */
export async function actualizarEstadoObservacion(id, resuelta) {
  return prisma.observacion.update({
    where: { id },
    data: { resuelta }
  });
}