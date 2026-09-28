import { prisma } from '../../config/prisma.js';

export const obtenerTodosPretests = async () => prisma.pretest.findMany({ orderBy: { id: 'desc' } });
export const crearPretestBD = async (datos) => prisma.pretest.create({ data: datos });
export const actualizarPretestBD = async (id, datos) => prisma.pretest.update({ where: { id: Number(id) }, data: datos });
export const eliminarPretestBD = async (id) => prisma.pretest.delete({ where: { id: Number(id) } });