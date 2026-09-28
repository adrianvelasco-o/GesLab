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
