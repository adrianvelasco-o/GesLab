import { z } from 'zod';

export const cambiarRolEsquema = z.object({
  rolNombre: z.enum(['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'ENCARGADO'], {
    errorMap: () => ({ message: 'Rol inválido. Los roles permitidos son: ADMINISTRADOR, DOCENTE, ESTUDIANTE, ENCARGADO' })
  })
});

export const cambiarEstadoEsquema = z.object({
  activo: z.boolean({ required_error: 'El campo activo es obligatorio y debe ser booleano' })
});
