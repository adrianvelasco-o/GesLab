import * as reservasService from './reservas.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

export async function crear(req, res, next) {
  try {
    const nuevaReserva = await reservasService.solicitarNuevaReserva({
      ...req.body,
      usuario: req.usuario
    });
    return responderExito(res, 201, 'Solicitud de reserva creada exitosamente', nuevaReserva);
  } catch (error) {
    next(error);
  }
}

export async function listar(req, res, next) {
  try {
    const reservas = await reservasService.obtenerReservasUsuario(req.usuario);
    return responderExito(res, 200, 'Reservas obtenidas correctamente', reservas);
  } catch (error) {
    next(error);
  }
}

export async function listarLaboratorios(req, res, next) {
  try {
    const { fecha } = req.query;
    const laboratorios = await reservasService.listarLaboratoriosDisponibles(fecha);

    let mensaje = 'Laboratorios y horarios obtenidos correctamente';
    if (fecha) {
      const [year, month, day] = fecha.split('-').map(Number);
      const fechaObj = new Date(Date.UTC(year, month - 1, day));
      const esDiaNoHabil = fechaObj.getUTCDay() === 0;

      mensaje = esDiaNoHabil
        ? 'No existen franjas configuradas para ese día'
        : 'Disponibilidad de laboratorios consultada correctamente';
    }

    return responderExito(res, 200, mensaje, laboratorios);
  } catch (error) {
    next(error);
  }
}

export async function obtenerPorId(req, res, next) {
  try {
    const reservaId = parseInt(req.params.id, 10);
    const reserva = await reservasService.obtenerDetalleReserva(reservaId, req.usuario);
    return responderExito(res, 200, 'Detalle de la reserva obtenido correctamente', reserva);
  } catch (error) {
    next(error);
  }
}

export async function aprobar(req, res, next) {
  try {
    const reservaId = parseInt(req.params.id, 10);
    const reservaAprobada = await reservasService.aprobarReserva(reservaId, req.usuario);
    return responderExito(res, 200, 'Reserva aprobada correctamente', reservaAprobada);
  } catch (error) {
    next(error);
  }
}

export async function rechazar(req, res, next) {
  try {
    const reservaId = parseInt(req.params.id, 10);
    const { motivo } = req.body;
    const reservaRechazada = await reservasService.rechazarReserva(reservaId, motivo, req.usuario);
    return responderExito(res, 200, 'Reserva rechazada correctamente', reservaRechazada);
  } catch (error) {
    next(error);
  }
}

export async function crearLaboratorio(req, res, next) {
  try {
    const laboratorio = await reservasService.crearNuevoLaboratorio(req.body);
    return responderExito(res, 201, 'Laboratorio registrado exitosamente', laboratorio);
  } catch (error) {
    next(error);
  }
}

export async function crearHorario(req, res, next) {
  try {
    const laboratorioId = parseInt(req.params.id, 10);
    const horario = await reservasService.crearHorarioLaboratorio(laboratorioId, req.body);
    return responderExito(res, 201, 'Franja horaria agregada exitosamente', horario);
  } catch (error) {
    next(error);
  }
}

