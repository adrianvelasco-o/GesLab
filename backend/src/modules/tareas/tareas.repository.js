import { prisma } from '../../config/prisma.js';

export const obtenerTodasLasTareas = async () => prisma.tarea.findMany({ orderBy: { id: 'desc' } });
export const crearTareaBD = async (datos) => prisma.tarea.create({ data: datos });
export const actualizarTareaBD = async (id, datos) => prisma.tarea.update({ where: { id: Number(id) }, data: datos });
export const eliminarTareaBD = async (id) => prisma.tarea.delete({ where: { id: Number(id) } });