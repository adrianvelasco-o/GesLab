import { z } from 'zod';

export const parametroIdTareaEsquema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'El id de la tarea debe ser numérico' })
    .int('El id de la tarea debe ser un entero')
    .positive('El id de la tarea debe ser positivo')
});

const camposTarea = {
  titulo: z
    .string({ required_error: 'El título de la tarea es obligatorio' })
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(150, 'El título no puede exceder 150 caracteres'),
  descripcion: z
    .string()
    .trim()
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .optional()
    .nullable(),
  duracion_estimada_min: z
    .number({
      required_error: 'La duración estimada es obligatoria',
      invalid_type_error: 'La duración estimada debe ser un número'
    })
    .int('La duración estimada debe ser un número entero de minutos')
    .min(1, 'La duración estimada debe ser de al menos 1 minuto')
    .max(480, 'La duración estimada no puede exceder 480 minutos')
};

export const crearTareaEsquema = z.object(camposTarea);

export const actualizarTareaEsquema = z
  .object(camposTarea)
  .partial()
  .refine((datos) => Object.keys(datos).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar'
  });
