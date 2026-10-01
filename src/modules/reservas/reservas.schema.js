import { z } from 'zod';

export const crearReservaEsquema = z.object({
  practicaId: z
    .number({ required_error: 'El ID de la práctica es obligatorio' })
    .int()
    .positive(),
  laboratorioId: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1),
  horarioId: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1),
  fechaReserva: z
    .string({ required_error: 'La fecha de reserva es obligatoria (formato AAAA-MM-DD)' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato AAAA-MM-DD')
});

export const rechazarReservaEsquema = z.object({
  motivo: z
    .string({ required_error: 'Debe especificar el motivo u observación del rechazo' })
    .min(3, 'El motivo debe tener al menos 3 caracteres')
    .trim()
});

export const crearLaboratorioEsquema = z.object({
  nombre: z
    .string({ required_error: 'El nombre del laboratorio es obligatorio' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .trim(),
  ubicacion: z
    .string({ required_error: 'La ubicación es obligatoria' })
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .trim(),
  capacidad: z.number().int().positive().optional().default(1),
  descripcion: z.string().optional().nullable()
});

export const crearHorarioEsquema = z.object({
  diaSemana: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'], {
    errorMap: () => ({ message: 'Día de la semana inválido' })
  }),
  horaInicio: z
    .string({ required_error: 'La hora de inicio es obligatoria (formato HH:MM)' })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'La hora de inicio debe tener formato HH:MM (24 horas)'),
  horaFin: z
    .string({ required_error: 'La hora de fin es obligatoria (formato HH:MM)' })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'La hora de fin debe tener formato HH:MM (24 horas)')
});

export const consultarDisponibilidadEsquema = z.object({
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato AAAA-MM-DD')
    .optional()
});

