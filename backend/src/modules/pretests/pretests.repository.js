import { prisma } from '../../config/prisma.js';

export const listarPretests = () => prisma.pretest.findMany({ orderBy: { id: 'desc' } });

export const buscarPretestPorId = (id) => prisma.pretest.findUnique({ where: { id } });

export const crearPretest = (datos) => prisma.pretest.create({ data: datos });

export const actualizarPretest = (id, datos) => prisma.pretest.update({ where: { id }, data: datos });

export const eliminarPretest = (id) => prisma.pretest.delete({ where: { id } });
