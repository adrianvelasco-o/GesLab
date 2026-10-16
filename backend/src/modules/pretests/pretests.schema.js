import { z } from 'zod';

export const NIVELES_EXPERIENCIA = ['Bajo', 'Intermedio', 'Avanzado'];

export const parametroIdPretestEsquema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'El id del pre-test debe ser numérico' })
    .int('El id del pre-test debe ser un entero')
    .positive('El id del pre-test debe ser positivo')
});

const camposPretest = {
  nombre_participante: z
    .string({ required_error: 'El nombre del participante es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(120, 'El nombre no puede exceder 120 caracteres'),
  edad: z
    .number({ required_error: 'La edad es obligatoria', invalid_type_error: 'La edad debe ser un número' })
    .int('La edad debe ser un número entero')
    .min(5, 'La edad debe ser de al menos 5 años')
    .max(120, 'La edad no puede exceder 120 años'),
  experiencia_tecnologica: z.enum(NIVELES_EXPERIENCIA, {
    errorMap: () => ({ message: `La experiencia tecnológica debe ser: ${NIVELES_EXPERIENCIA.join(', ')}` })
  }),
  observaciones: z
    .string()
    .trim()
    .max(2000, 'Las observaciones no pueden exceder 2000 caracteres')
    .optional()
    .nullable()
};

export const crearPretestEsquema = z.object(camposPretest);

export const actualizarPretestEsquema = z
  .object(camposPretest)
  .partial()
  .refine((datos) => Object.keys(datos).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar'
  });
