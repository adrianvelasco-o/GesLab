import { z } from 'zod';

export const crearPracticaEsquema = z.object({
  titulo: z
    .string({ required_error: 'El título de la práctica es obligatorio' })
    .min(3, 'El título debe tener al menos 3 caracteres')
    .trim(),
  descripcion: z
    .string({ required_error: 'La descripción es obligatoria' })
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .trim(),
  objetivo: z
    .string({ required_error: 'El objetivo es obligatorio' })
    .min(5, 'El objetivo debe tener al menos 5 caracteres')
    .trim(),
  docenteId: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable()
});

export const actualizarPracticaEsquema = z.object({
  titulo: z.string().min(3).trim().optional(),
  descripcion: z.string().min(5).trim().optional(),
  objetivo: z.string().min(5).trim().optional(),
  docenteId: z.number().int().positive().optional().nullable()
});

export const crearInstrumentoEsquema = z.object({
  tipo: z.enum([
    'GUIA_OBSERVACION',
    'CUESTIONARIO_PRE_TEST',
    'BANCO_TAREAS',
    'CUESTIONARIO_POST_TEST'
  ], {
    errorMap: () => ({ message: 'Tipo de instrumento inválido' })
  }),
  nombre: z
    .string({ required_error: 'El nombre del instrumento es obligatorio' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .trim(),
  instrucciones: z.string().optional().nullable(),
  contenido: z.any().optional().nullable()
});

export const revisionDocenteEsquema = z.object({
  resultado: z.enum(['APROBADA', 'RECHAZADA'], {
    errorMap: () => ({ message: 'El resultado debe ser APROBADA o RECHAZADA' })
  }),
  comentariosGenerales: z.string().optional().nullable(),
  observaciones: z.array(
    z.object({
      seccion: z.string().min(2, 'La sección es obligatoria'),
      detalle: z.string().min(5, 'El detalle de la observación debe tener al menos 5 caracteres')
    })
  ).optional()
});
