import { z } from 'zod';

export const loginEsquema = z.object({
  correoInstitucional: z
    .string({ required_error: 'El correo institucional es obligatorio' })
    .email('El correo institucional no tiene un formato válido')
    .trim(),
  contrasena: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña no puede estar vacía')
});

export const registroEsquema = z.object({
  nombres: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .trim(),
  apellidos: z
    .string({ required_error: 'El apellido es obligatorio' })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .trim(),
  correoInstitucional: z
    .string({ required_error: 'El correo institucional es obligatorio' })
    .email('El correo institucional no tiene un formato válido')
    .trim(),
  contrasena: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rolNombre: z
    .enum(['ESTUDIANTE', 'DOCENTE', 'ENCARGADO', 'ADMINISTRADOR'])
    .optional()
    .default('ESTUDIANTE')
});
