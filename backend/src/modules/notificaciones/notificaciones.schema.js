import { z } from 'zod';

export const registrarDispositivoEsquema = z.object({
  tokenFirebase: z
    .string({ required_error: 'El token de Firebase (FCM) es obligatorio' })
    .min(1, 'El token de Firebase no puede estar vacío')
    .trim(),
  tipoDispositivo: z.enum(['ANDROID', 'IOS'], {
    errorMap: () => ({ message: 'El tipo de dispositivo debe ser ANDROID o IOS' })
  })
});
