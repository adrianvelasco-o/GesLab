import {
  esFechaCalendarioValida,
  fechaHoyColombia,
  horaATiempoUtc
} from '../src/utils/fechas.js';
import {
  evaluarDocumentacion,
  describirFaltantes
} from '../src/utils/documentacionReserva.js';
import { crearTareaEsquema, actualizarTareaEsquema, parametroIdTareaEsquema } from '../src/modules/tareas/tareas.schema.js';
import { crearPretestEsquema, actualizarPretestEsquema } from '../src/modules/pretests/pretests.schema.js';

describe('Fechas y horas de reservas', () => {
  test('esFechaCalendarioValida rechaza fechas inexistentes que JavaScript "corrige" en silencio', () => {
    expect(esFechaCalendarioValida('2026-10-20')).toBe(true);
    expect(esFechaCalendarioValida('2026-02-31')).toBe(false);
    expect(esFechaCalendarioValida('2026-13-01')).toBe(false);
    expect(esFechaCalendarioValida('20/10/2026')).toBe(false);
    expect(esFechaCalendarioValida(undefined)).toBe(false);
  });

  test('fechaHoyColombia devuelve AAAA-MM-DD', () => {
    expect(fechaHoyColombia()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('horaATiempoUtc no depende de la zona horaria del servidor', () => {
    const fecha = horaATiempoUtc('08:30');
    expect(fecha.toISOString()).toBe('1970-01-01T08:30:00.000Z');
  });
});

describe('Documentación obligatoria para reservar', () => {
  test('está completa solo con consentimiento y protocolo', () => {
    const completa = evaluarDocumentacion([{ tipo: 'CONSENTIMIENTO_INFORMADO' }, { tipo: 'PROTOCOLO_PRUEBA' }, { tipo: 'GUIA_ACTIVIDAD' }]);
    expect(completa.completa).toBe(true);
    expect(completa.presentes).toBe(2);
  });

  test('informa qué documentos faltan y los complementarios no cuentan', () => {
    const parcial = evaluarDocumentacion([{ tipo: 'PROTOCOLO_PRUEBA' }, { tipo: 'GUIA_ACTIVIDAD' }]);
    expect(parcial.completa).toBe(false);
    expect(parcial.faltantes).toEqual(['CONSENTIMIENTO_INFORMADO']);
    expect(describirFaltantes(parcial.faltantes)).toBe('Consentimiento informado');
  });

  test('sin documentos (o sin lista) faltan ambos', () => {
    expect(evaluarDocumentacion([]).faltantes.length).toBe(2);
    expect(evaluarDocumentacion(undefined).completa).toBe(false);
  });
});

describe('Esquemas de Tareas (HU14)', () => {
  test('acepta una tarea válida', () => {
    const res = crearTareaEsquema.safeParse({ titulo: 'Buscar un producto', descripcion: 'Paso a paso', duracion_estimada_min: 5 });
    expect(res.success).toBe(true);
  });

  test('rechaza título corto, duración inválida y cadenas en lugar de números', () => {
    expect(crearTareaEsquema.safeParse({ titulo: 'ab', duracion_estimada_min: 5 }).success).toBe(false);
    expect(crearTareaEsquema.safeParse({ titulo: 'Tarea válida', duracion_estimada_min: 0 }).success).toBe(false);
    expect(crearTareaEsquema.safeParse({ titulo: 'Tarea válida', duracion_estimada_min: '5' }).success).toBe(false);
  });

  test('descarta campos no permitidos (mass assignment)', () => {
    const res = crearTareaEsquema.safeParse({ titulo: 'Tarea válida', duracion_estimada_min: 5, id: 99, creado_en: '2000-01-01' });
    expect(res.success).toBe(true);
    expect(res.data.id).toBeUndefined();
    expect(res.data.creado_en).toBeUndefined();
  });

  test('actualización parcial exige al menos un campo', () => {
    expect(actualizarTareaEsquema.safeParse({}).success).toBe(false);
    expect(actualizarTareaEsquema.safeParse({ duracion_estimada_min: 10 }).success).toBe(true);
  });

  test('el id de la ruta debe ser un entero positivo', () => {
    expect(parametroIdTareaEsquema.safeParse({ id: '7' }).data.id).toBe(7);
    expect(parametroIdTareaEsquema.safeParse({ id: 'abc' }).success).toBe(false);
    expect(parametroIdTareaEsquema.safeParse({ id: '-1' }).success).toBe(false);
  });
});

describe('Esquemas de Pre-Test (HU15)', () => {
  const valido = { nombre_participante: 'Ana Pérez', edad: 24, experiencia_tecnologica: 'Intermedio', observaciones: 'Ninguna' };

  test('acepta un pre-test válido', () => {
    expect(crearPretestEsquema.safeParse(valido).success).toBe(true);
  });

  test('rechaza experiencia fuera del catálogo y edades absurdas', () => {
    expect(crearPretestEsquema.safeParse({ ...valido, experiencia_tecnologica: 'Experto' }).success).toBe(false);
    expect(crearPretestEsquema.safeParse({ ...valido, edad: 3 }).success).toBe(false);
    expect(crearPretestEsquema.safeParse({ ...valido, edad: 200 }).success).toBe(false);
  });

  test('actualización parcial', () => {
    expect(actualizarPretestEsquema.safeParse({}).success).toBe(false);
    expect(actualizarPretestEsquema.safeParse({ edad: 30 }).success).toBe(true);
  });
});
