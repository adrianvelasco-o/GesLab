import { prisma } from '../../config/prisma.js';

export const listarTareas = () => prisma.tarea.findMany({ orderBy: { id: 'desc' } });

export const buscarTareaPorId = (id) => prisma.tarea.findUnique({ where: { id } });

export const crearTarea = (datos) => prisma.tarea.create({ data: datos });

export const actualizarTarea = (id, datos) => prisma.tarea.update({ where: { id }, data: datos });

export const eliminarTarea = (id) => prisma.tarea.delete({ where: { id } });
