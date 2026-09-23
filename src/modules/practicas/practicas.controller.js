import * as practicasService from './practicas.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

export async function crear(req, res, next) {
  try {
    const nuevaPractica = await practicasService.crearNuevaPractica(req.usuario.id, req.body);
    return responderExito(res, 201, 'Práctica creada exitosamente', nuevaPractica);
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const practicaActualizada = await practicasService.actualizarPractica(practicaId, req.body, req.usuario);
    return responderExito(res, 200, 'Práctica actualizada correctamente', practicaActualizada);
  } catch (error) {
    next(error);
  }
}

export async function enviarRevision(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const practicaEnviada = await practicasService.enviarPracticaARevision(practicaId, req.usuario);
    return responderExito(res, 200, 'Práctica enviada a revisión docente exitosamente', practicaEnviada);
  } catch (error) {
    next(error);
  }
}

export async function listar(req, res, next) {
  try {
    const practicas = await practicasService.obtenerPracticasUsuario(req.usuario);
    return responderExito(res, 200, 'Prácticas obtenidas correctamente', practicas);
  } catch (error) {
    next(error);
  }
}

export async function obtenerPorId(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const practica = await practicasService.obtenerPracticaDetalle(practicaId, req.usuario);
    return responderExito(res, 200, 'Detalle de la práctica obtenido correctamente', practica);
  } catch (error) {
    next(error);
  }
}

// -------------------------------------------------------------
// INSTRUMENTOS
// -------------------------------------------------------------

export async function crearInstrumento(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const instrumento = await practicasService.agregarInstrumento(practicaId, req.body, req.usuario);
    return responderExito(res, 201, 'Instrumento de evaluación registrado exitosamente', instrumento);
  } catch (error) {
    next(error);
  }
}

export async function listarInstrumentos(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const instrumentos = await practicasService.obtenerInstrumentos(practicaId, req.usuario);
    return responderExito(res, 200, 'Instrumentos obtenidos correctamente', instrumentos);
  } catch (error) {
    next(error);
  }
}

export async function eliminarInstrumento(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const instrumentoId = parseInt(req.params.instrumentoId, 10);
    await practicasService.eliminarInstrumento(practicaId, instrumentoId, req.usuario);
    return responderExito(res, 200, 'Instrumento eliminado correctamente');
  } catch (error) {
    next(error);
  }
}

// -------------------------------------------------------------
// REVISIONES DOCENTES
// -------------------------------------------------------------

export async function registrarRevision(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const revision = await practicasService.registrarRevisionDocente(practicaId, req.body, req.usuario);
    return responderExito(res, 201, 'Revisión docente registrada exitosamente', revision);
  } catch (error) {
    next(error);
  }
}

export async function listarRevisiones(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const revisiones = await practicasService.obtenerRevisionesDePractica(practicaId, req.usuario);
    return responderExito(res, 200, 'Revisiones obtenidas correctamente', revisiones);
  } catch (error) {
    next(error);
  }
}

//(CU 11)
export async function resolverObservacion(req, res, next) {
  try {
    const { id } = req.params;
    const resultado = await practicasService.marcarObservacionComoResuelta(
      Number(id), 
      req.usuario
    );

    return res.status(200).json({
      success: true,
      mensaje: 'Observación marcada como resuelta exitosamente',
      data: resultado
    });
  } catch (error) {
    next(error);
  }
}