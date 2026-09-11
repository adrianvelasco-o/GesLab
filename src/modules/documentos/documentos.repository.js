import { prisma } from '../../config/prisma.js';

export async function crearDocumento(datosDocumento) {
  return prisma.documento.create({
    data: datosDocumento
  });
}

export async function listarDocumentosPorPracticaId(practicaId) {
  return prisma.documento.findMany({
    where: { practicaId },
    orderBy: { creadoEn: 'desc' }
  });
}
