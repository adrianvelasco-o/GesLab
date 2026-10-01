import { prisma } from '../../config/prisma.js';

export async function crearNotificacion({ usuarioId, titulo, mensaje, tipo, referenciaEntidad, referenciaId }) {
  return prisma.notificacion.create({
    data: {
      usuarioId,
      titulo,
      mensaje,
      tipo,
      referenciaEntidad: referenciaEntidad ? String(referenciaEntidad) : null,
      referenciaId: referenciaId ? parseInt(referenciaId, 10) : null
    }
  });
}

export async function listarNotificacionesPorUsuario(usuarioId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;

  const [notificaciones, total] = await Promise.all([
    prisma.notificacion.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: 'desc' },
      skip,
      take: limit
    }),
    prisma.notificacion.count({ where: { usuarioId } })
  ]);

  return {
    notificaciones,
    paginacion: {
      total,
      paginaActual: page,
      limite: limit,
      totalPaginas: Math.ceil(total / limit)
    }
  };
}

export async function contarNotificacionesNoLeidas(usuarioId) {
  return prisma.notificacion.count({
    where: {
      usuarioId,
      leida: false
    }
  });
}

export async function buscarNotificacionPorId(id) {
  return prisma.notificacion.findUnique({
    where: { id }
  });
}

export async function marcarNotificacionLeida(id) {
  return prisma.notificacion.update({
    where: { id },
    data: {
      leida: true,
      leidaEn: new Date()
    }
  });
}

export async function marcarTodasNotificacionesLeidas(usuarioId) {
  return prisma.notificacion.updateMany({
    where: { usuarioId, leida: false },
    data: {
      leida: true,
      leidaEn: new Date()
    }
  });
}

// -------------------------------------------------------------
// GESTIÓN DE DISPOSITIVOS FCM
// -------------------------------------------------------------

export async function registrarOActualizarDispositivo({ usuarioId, tokenFirebase, tipoDispositivo }) {
  const ahora = new Date();

  return prisma.dispositivoUsuario.upsert({
    where: { tokenFirebase },
    update: {
      usuarioId,
      tipoDispositivo,
      activo: true,
      ultimoUsoEn: ahora,
      actualizadoEn: ahora
    },
    create: {
      usuarioId,
      tokenFirebase,
      tipoDispositivo,
      activo: true,
      ultimoUsoEn: ahora
    }
  });
}

export async function buscarDispositivoPorToken(tokenFirebase) {
  return prisma.dispositivoUsuario.findUnique({
    where: { tokenFirebase }
  });
}

export async function obtenerTokensActivosPorUsuario(usuarioId) {
  const dispositivos = await prisma.dispositivoUsuario.findMany({
    where: {
      usuarioId,
      activo: true
    },
    select: { tokenFirebase: true }
  });

  return dispositivos.map((d) => d.tokenFirebase);
}

export async function desactivarOEliminarToken(tokenFirebase) {
  return prisma.dispositivoUsuario.deleteMany({
    where: { tokenFirebase }
  });
}

export async function eliminarDispositivoPorTokenYUsuario(tokenFirebase, usuarioId) {
  return prisma.dispositivoUsuario.deleteMany({
    where: {
      tokenFirebase,
      usuarioId
    }
  });
}
