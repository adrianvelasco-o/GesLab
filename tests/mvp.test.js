import request from 'supertest';
import app from '../src/app.js';
import {
  crearPracticaEsquema,
  crearInstrumentoEsquema,
  revisionDocenteEsquema,
  finalizarPracticaEsquema,
  resolverObservacionEsquema
} from '../src/modules/practicas/practicas.schema.js';
import {
  cambiarRolEsquema,
  cambiarEstadoEsquema
} from '../src/modules/usuarios/usuarios.schema.js';
import {
  crearLaboratorioEsquema,
  crearHorarioEsquema,
  consultarDisponibilidadEsquema,
  crearReservaEsquema,
  cambiarEstadoHorarioEsquema
} from '../src/modules/reservas/reservas.schema.js';

describe('API GesLab', () => {
  test('GET /api/salud debe retornar 200 OK y estado del servidor', async () => {
    const res = await request(app).get('/api/salud');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('exito', true);
    expect(res.body.datos).toHaveProperty('estado', 'OK');
  });

  test('GET /api/ruta-inexistente debe retornar error 404', async () => {
    const res = await request(app).get('/api/ruta-inexistente');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('exito', false);
  });

  describe('Esquemas de Validación Zod - Prácticas e Instrumentos', () => {
    test('crearPracticaEsquema debe validar correctamente', () => {
      const datosValidos = {
        titulo: 'Práctica de Usabilidad App Móvil',
        descripcion: 'Evaluación de interfaz con usuarios finales',
        objetivo: 'Medir tiempo de tarea y tasa de errores'
      };
      const resultado = crearPracticaEsquema.safeParse(datosValidos);
      expect(resultado.success).toBe(true);
    });

    test('crearPracticaEsquema debe fallar si faltan campos obligatorios', () => {
      const datosInvalidos = { titulo: 'AB' };
      const resultado = crearPracticaEsquema.safeParse(datosInvalidos);
      expect(resultado.success).toBe(false);
    });

    test('crearInstrumentoEsquema debe validar tipos válidos', () => {
      const instrumentoValido = {
        tipo: 'GUIA_OBSERVACION',
        nombre: 'Guía de observación heurística',
        instrucciones: 'Marcar fallos visuales'
      };
      const resultado = crearInstrumentoEsquema.safeParse(instrumentoValido);
      expect(resultado.success).toBe(true);
    });

    test('crearInstrumentoEsquema debe rechazar tipo inválido', () => {
      const instrumentoInvalido = {
        tipo: 'TIPO_INVENTADO',
        nombre: 'Guía'
      };
      const resultado = crearInstrumentoEsquema.safeParse(instrumentoInvalido);
      expect(resultado.success).toBe(false);
    });

    test('revisionDocenteEsquema debe validar resultado APROBADA o RECHAZADA', () => {
      const revisionValida = {
        resultado: 'APROBADA',
        comentariosGenerales: 'Práctica bien planteada',
        observaciones: [
          { seccion: 'Objetivos', detalle: 'Aclarar métricas de éxito' }
        ]
      };
      const resultado = revisionDocenteEsquema.safeParse(revisionValida);
      expect(resultado.success).toBe(true);
    });

    test('finalizarPracticaEsquema debe validar estados FINALIZADA y CERRADA', () => {
      const resultadoFinalizada = finalizarPracticaEsquema.safeParse({ estado: 'FINALIZADA' });
      expect(resultadoFinalizada.success).toBe(true);

      const resultadoCerrada = finalizarPracticaEsquema.safeParse({ estado: 'CERRADA' });
      expect(resultadoCerrada.success).toBe(true);

      const resultadoInvalido = finalizarPracticaEsquema.safeParse({ estado: 'INVALIDO' });
      expect(resultadoInvalido.success).toBe(false);
    });

    test('resolverObservacionEsquema debe validar booleano o valor por defecto', () => {
      const resPorDefecto = resolverObservacionEsquema.safeParse({});
      expect(resPorDefecto.success).toBe(true);
      expect(resPorDefecto.data.resuelta).toBe(true);

      const resExplicito = resolverObservacionEsquema.safeParse({ resuelta: false });
      expect(resExplicito.success).toBe(true);
      expect(resExplicito.data.resuelta).toBe(false);

      const resInvalido = resolverObservacionEsquema.safeParse({ resuelta: 'si' });
      expect(resInvalido.success).toBe(false);
    });
  });

  describe('Esquemas de Validación Zod - Administración de Usuarios', () => {
    test('cambiarRolEsquema debe aceptar roles válidos', () => {
      expect(cambiarRolEsquema.safeParse({ rolNombre: 'DOCENTE' }).success).toBe(true);
      expect(cambiarRolEsquema.safeParse({ rolNombre: 'ENCARGADO' }).success).toBe(true);
      expect(cambiarRolEsquema.safeParse({ rolNombre: 'ROL_INEXISTENTE' }).success).toBe(false);
    });

    test('cambiarEstadoEsquema debe requerir booleano', () => {
      expect(cambiarEstadoEsquema.safeParse({ activo: false }).success).toBe(true);
      expect(cambiarEstadoEsquema.safeParse({ activo: 'true' }).success).toBe(false);
    });
  });

  describe('Esquemas de Validación Zod - Laboratorios y Horarios', () => {
    test('crearLaboratorioEsquema debe validar correctamente', () => {
      const labValido = {
        nombre: 'GesLab Principal',
        ubicacion: 'Edificio B - Piso 2',
        capacidad: 10
      };
      expect(crearLaboratorioEsquema.safeParse(labValido).success).toBe(true);
    });

    test('crearHorarioEsquema debe validar día y formato de hora HH:MM', () => {
      const horarioValido = {
        diaSemana: 'LUNES',
        horaInicio: '08:00',
        horaFin: '12:00'
      };
      expect(crearHorarioEsquema.safeParse(horarioValido).success).toBe(true);

      const horarioInvalido = {
        diaSemana: 'DOMINGO', // No está en enum DiaSemana
        horaInicio: '8am',
        horaFin: '12pm'
      };
      expect(crearHorarioEsquema.safeParse(horarioInvalido).success).toBe(false);
    });

    test('consultarDisponibilidadEsquema debe validar fecha opcional en formato AAAA-MM-DD', () => {
      expect(consultarDisponibilidadEsquema.safeParse({}).success).toBe(true);
      expect(consultarDisponibilidadEsquema.safeParse({ fecha: '2026-10-15' }).success).toBe(true);
      expect(consultarDisponibilidadEsquema.safeParse({ fecha: '15-10-2026' }).success).toBe(false);
      expect(consultarDisponibilidadEsquema.safeParse({ fecha: 'invalida' }).success).toBe(false);
    });

    test('crearReservaEsquema debe validar campos obligatorios y formato de fecha', () => {
      const reservaValida = {
        practicaId: 1,
        laboratorioId: 1,
        horarioId: 1,
        fechaReserva: '2026-10-15'
      };
      expect(crearReservaEsquema.safeParse(reservaValida).success).toBe(true);

      const reservaSinFecha = { practicaId: 1 };
      expect(crearReservaEsquema.safeParse(reservaSinFecha).success).toBe(false);

      const reservaFechaInvalida = { practicaId: 1, fechaReserva: 'ayer' };
      expect(crearReservaEsquema.safeParse(reservaFechaInvalida).success).toBe(false);
    });

    test('cambiarEstadoHorarioEsquema debe requerir booleano en activo', () => {
      expect(cambiarEstadoHorarioEsquema.safeParse({ activo: false }).success).toBe(true);
      expect(cambiarEstadoHorarioEsquema.safeParse({ activo: true }).success).toBe(true);
      expect(cambiarEstadoHorarioEsquema.safeParse({ activo: 'false' }).success).toBe(false);
      expect(cambiarEstadoHorarioEsquema.safeParse({}).success).toBe(false);
    });
  });
});



