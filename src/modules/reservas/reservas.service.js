import * as reservasRepository from './reservas.repository.js';
import * as practicasRepository from '../practicas/practicas.repository.js';
import { AppError } from '../../errors/AppError.js';
import { CODIGOS_ERROR } from '../../constants/codigosError.js';


export async function solicitarReserva({ practicaId, laboratorioId = 1, horarioId = 1, fechaReserva, usuario }) {
  // 1. Verificar que la práctica exista
  const practica = await practicasRepository.buscarPracticaPorId(practicaId);
  if (!practica) {
    throw new AppError('La práctica especificada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // 2. Verificar que el estudiante sea el dueño de la práctica (o admin/encargado)
  if (practica.estudianteId !== usuario.id && !['ADMINISTRADOR', 'ENCARGADO'].includes(usuario.rolNombre)) {
    throw new AppError('Solo puedes solicitar reservas para tus propias prácticas', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  // 3. VALIDACIÓN CU13 / RF19: La práctica debe estar APROBADA para poder reservar
  if (practica.estado !== 'APROBADA' && usuario.rolNombre !== 'ADMINISTRADOR') {
    throw new AppError(
      `Solo se pueden solicitar reservas para prácticas que hayan sido APROBADAS (Estado actual: ${practica.estado})`,
      400,
      CODIGOS_ERROR.TRANSICION_ESTADO_INVALIDA
    );
  }

  // 4. Crear la reserva en estado PENDIENTE
  return reservasRepository.crearReserva({
    practicaId,
    laboratorioId,
    horarioId,
    solicitanteId: usuario.id,
    fechaReserva: new Date(fechaReserva),
    estado: 'PENDIENTE'
  });
}

// Alias para compatibilidad
export const solicitarNuevaReserva = solicitarReserva;

export async function obtenerReservasUsuario(usuario) {
  // Administradores y encargados pueden consultar todas las solicitudes
  if (['ADMINISTRADOR', 'ENCARGADO'].includes(usuario.rolNombre)) {
    return reservasRepository.listarTodasLasReservas();
  }
  return reservasRepository.listarReservasPorUsuario(usuario.id);
}

export async function obtenerDetalleReserva(reservaId, usuario) {
  const reserva = await reservasRepository.buscarReservaPorId(reservaId);
  if (!reserva) {
    throw new AppError('La reserva solicitada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  const tienePermiso =
    ['ADMINISTRADOR', 'ENCARGADO'].includes(usuario.rolNombre) ||
    reserva.solicitanteId === usuario.id;

  if (!tienePermiso) {
    throw new AppError('No tienes permiso para consultar esta reserva', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return reserva;
}

export async function aprobarReserva(reservaId, usuario) {
  const reserva = await reservasRepository.buscarReservaPorId(reservaId);
  if (!reserva) {
    throw new AppError('La reserva a aprobar no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // Regla de negocio: Un estudiante no puede aprobar sus propias reservas
  if (reserva.solicitanteId === usuario.id && usuario.rolNombre !== 'ADMINISTRADOR') {
    throw new AppError('Un estudiante no puede aprobar su propia solicitud de reserva', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return reservasRepository.actualizarEstadoReserva(reservaId, {
    estado: 'APROBADA',
    revisorId: usuario.id,
    motivoRechazoCancelacion: null
  });
}

export async function rechazarReserva(reservaId, motivo, usuario) {
  const reserva = await reservasRepository.buscarReservaPorId(reservaId);
  if (!reserva) {
    throw new AppError('La reserva a rechazar no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  return reservasRepository.actualizarEstadoReserva(reservaId, {
    estado: 'RECHAZADA',
    revisorId: usuario.id,
    motivoRechazoCancelacion: motivo
  });
}

export async function listarLaboratoriosDisponibles() {
  return reservasRepository.listarLaboratoriosConHorarios();
}



const DIAS_MAPA = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

export async function consultarDisponibilidad(fechaTexto) {
  if (!fechaTexto) {
    throw new AppError('La fecha es requerida para consultar disponibilidad', 400, CODIGOS_ERROR.PARAMETRO_INVALIDO);
  }

  // Parsear la fecha en formato YYYY-MM-DD ajustada a UTC/Local
  const fechaObjeto = new Date(`${fechaTexto}T00:00:00.000Z`);
  if (isNaN(fechaObjeto.getTime())) {
    throw new AppError('El formato de fecha no es válido (Usar YYYY-MM-DD)', 400, CODIGOS_ERROR.PARAMETRO_INVALIDO);
  }

  // Determinar el día de la semana según Enum DiaSemana (LUNES, MARTES, etc.)
  const diaSemanaNombre = DIAS_MAPA[fechaObjeto.getUTCDay()];
  if (diaSemanaNombre === 'DOMINGO') {
    return []; // El laboratorio no opera domingos
  }

  // 1. Obtener laboratorios y las reservas existentes del día
  const [laboratorios, reservasExistentes] = await Promise.all([
    reservasRepository.obtenerLaboratoriosConHorarios(),
    reservasRepository.obtenerReservasPorFecha(fechaObjeto)
  ]);

  // Set con las claves `${laboratorioId}_${horarioId}` para verificación rápida O(1)
  const ocupadosSet = new Set(
    reservasExistentes.map(r => `${r.laboratorioId}_${r.horarioId}`)
  );

  // 2. Mapear laboratorios y filtrar solo los horarios del día solicitado
  const disponibilidad = laboratorios.map((lab) => {
    const horariosDelDia = lab.horarios
      .filter((h) => h.diaSemana === diaSemanaNombre)
      .map((h) => {
        const estaOcupado = ocupadosSet.has(`${lab.id}_${h.id}`);
        return {
          horarioId: h.id,
          diaSemana: h.diaSemana,
          horaInicio: h.horaInicio.toISOString().substring(11, 16), // Formato "HH:mm"
          horaFin: h.horaFin.toISOString().substring(11, 16),
          estado: estaOcupado ? 'OCUPADO' : 'DISPONIBLE'
        };
      });

    return {
      laboratorioId: lab.id,
      nombre: lab.nombre,
      ubicacion: lab.ubicacion,
      capacidad: lab.capacidad,
      horarios: horariosDelDia
    };
  });

  return disponibilidad;
}