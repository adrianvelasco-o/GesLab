import { z } from 'zod';

export const tiposDocumentoValidos = [
  'CONSENTIMIENTO_INFORMADO',
  'PROTOCOLO_PRUEBA',
  'GUIA_ACTIVIDAD',
  'REPORTE_FINAL',
  'EVIDENCIA',
  'OTRO'
];

export const subirDocumentoEsquema = z.object({
  practicaId: z.preprocess(
    (val) => (val !== undefined && val !== null && !isNaN(Number(val)) ? Number(val) : val),
    z.number({ required_error: 'El campo practicaId es obligatorio' })
      .int({ message: 'El practicaId debe ser un número entero' })
      .positive({ message: 'El practicaId debe ser un identificador positivo' })
  ),
  tipo: z
    .enum(tiposDocumentoValidos, {
      errorMap: () => ({
        message: `El tipo de documento debe ser uno de los siguientes: ${tiposDocumentoValidos.join(', ')}`
      })
    })
    .optional()
    .default('CONSENTIMIENTO_INFORMADO')
});

export const parametroIdPracticaEsquema = z.object({
  id: z.preprocess(
    (val) => (val !== undefined && val !== null && !isNaN(Number(val)) ? Number(val) : val),
    z.number({ required_error: 'El identificador de la práctica es obligatorio' })
      .int()
      .positive({ message: 'El identificador debe ser un número positivo' })
  )
});

export const parametroIdDocumentoEsquema = z.object({
  id: z.preprocess(
    (val) => (val !== undefined && val !== null && !isNaN(Number(val)) ? Number(val) : val),
    z.number({ required_error: 'El identificador del documento es obligatorio' })
      .int()
      .positive({ message: 'El identificador del documento debe ser un número positivo' })
  )
});

