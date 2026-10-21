import { prisma } from '../../config/prisma.js';

export async function buscarUsuarioPorCorreo(correoInstitucional) {
  return prisma.usuario.findUnique({
    where: { correoInstitucional },
    include: { rol: true }
  });
}

export async function buscarUsuarioPorId(id) {
  return prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      correoInstitucional: true,
      activo: true,
      creadoEn: true,
      rol: {
        select: {
          id: true,
          nombre: true,
          descripcion: true
        }
      }
    }
  });
}

export async function buscarRolPorNombre(nombreRol) {
  return prisma.rol.findUnique({
    where: { nombre: nombreRol }
  });
}

export async function crearUsuario(datosUsuario) {
  return prisma.usuario.create({
    data: datosUsuario,
    include: { rol: true }
  });
}
