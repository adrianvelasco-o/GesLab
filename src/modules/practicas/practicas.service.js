import * as practicasRepository from './practicas.repository.js';
import { AppError } from '../../errors/AppError.js';
import { CODIGOS_ERROR } from '../../constants/codigosError.js';

export async function crearNuevaPractica(estudianteId, datos) {
  return practicasRepository.crearPractica({
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    objetivo: datos.objetivo,
    estudianteId,
    docenteId: datos.docenteId || null,
    estado: 'BORRADOR'
  });
}

export async function actualizarPractica(practicaId, datos, usuario) {
  const practica = await practicasRepository.buscarPracticaPorId(practicaId);
  if (!practica) {
    throw new AppError('La práctica solicitada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // Verificar que el estudiante sea el dueño
  const esDuenio = practica.estudianteId === usuario.id || ['ADMINISTRADOR'].includes(usuario.rolNombre);
  if (!esDuenio) {
    throw new AppError('No tienes permisos para modificar esta práctica', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  // Solo se puede modificar en BORRADOR o RECHAZADA
  if (!['BORRADOR', 'RECHAZADA'].includes(practica.estado) && usuario.rolNombre !== 'ADMINISTRADOR') {
    throw new AppError('Solo se pueden modificar prácticas en estado BORRADOR o RECHAZADA', 400, CODIGOS_ERROR.TRANSICION_ESTADO_INVALIDA);
  }

  return practicasRepository.actualizarPractica(practicaId, datos);
}

export async function enviarPracticaARevision(practicaId, usuario) {
  const practica = await practicasRepository.buscarPracticaPorId(practicaId);
  if (!practica) {
    throw new AppError('La práctica solicitada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  if (practica.estudianteId !== usuario.id && usuario.rolNombre !== 'ADMINISTRADOR') {
    throw new AppError('Solo el creador de la práctica puede enviarla a revisión', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  if (!['BORRADOR', 'RECHAZADA'].includes(practica.estado)) {
    throw new AppError('La práctica ya fue enviada o no se encuentra en estado editable', 400, CODIGOS_ERROR.TRANSICION_ESTADO_INVALIDA);
  }

  return practicasRepository.actualizarPractica(practicaId, { estado: 'EN_REVISION' });
}

export async function obtenerPracticasUsuario(usuario) {
  if (['ADMINISTRADOR', 'ENCARGADO'].includes(usuario.rolNombre)) {
    return practicasRepository.listarTodasLasPracticas();
  }
  if (usuario.rolNombre === 'DOCENTE') {
    // Los docentes pueden ver todas las que estén en revisión o asignadas a ellos
    return practicasRepository.listarTodasLasPracticas();
  }
  return practicasRepository.listarPracticasPorEstudiante(usuario.id);
}

export async function obtenerPracticaDetalle(practicaId, usuario) {
  const practica = await practicasRepository.buscarPracticaPorId(practicaId);

  if (!practica) {
    throw new AppError('La práctica solicitada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  const tienePermiso =
    ['ADMINISTRADOR', 'ENCARGADO', 'DOCENTE'].includes(usuario.rolNombre) ||
    practica.estudianteId === usuario.id;

  if (!tienePermiso) {
    throw new AppError('No tienes permisos para consultar esta práctica', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return practica;
}

// -------------------------------------------------------------
// INSTRUMENTOS
// -------------------------------------------------------------

export async function agregarInstrumento(practicaId, datos, usuario) {
  const practica = await practicasRepository.buscarPracticaPorId(practicaId);
  if (!practica) {
    throw new AppError('La práctica especificada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  const esDuenio = practica.estudianteId === usuario.id || ['ADMINISTRADOR'].includes(usuario.rolNombre);
  if (!esDuenio) {
    throw new AppError('No tienes permisos para agregar instrumentos a esta práctica', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return practicasRepository.crearInstrumento({
    practicaId,
    tipo: datos.tipo,
    nombre: datos.nombre,
    instrucciones: datos.instrucciones || null,
    contenido: datos.contenido || null
  });
}

export async function obtenerInstrumentos(practicaId, usuario) {
  await obtenerPracticaDetalle(practicaId, usuario);
  return practicasRepository.listarInstrumentosPorPractica(practicaId);
}

export async function eliminarInstrumento(practicaId, instrumentoId, usuario) {
  const instrumento = await practicasRepository.buscarInstrumentoPorId(instrumentoId);
  if (!instrumento || instrumento.practicaId !== practicaId) {
    throw new AppError('El instrumento especificado no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  const practica = await practicasRepository.buscarPracticaPorId(practicaId);
  const esDuenio = practica.estudianteId === usuario.id || ['ADMINISTRADOR'].includes(usuario.rolNombre);
  if (!esDuenio) {
    throw new AppError('No tienes permisos para eliminar este instrumento', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return practicasRepository.eliminarInstrumento(instrumentoId);
}

// -------------------------------------------------------------
// REVISIONES DOCENTES
// -------------------------------------------------------------

export async function registrarRevisionDocente(practicaId, datos, usuario) {
  const practica = await practicasRepository.buscarPracticaPorId(practicaId);
  if (!practica) {
    throw new AppError('La práctica a revisar no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  if (practica.estado !== 'EN_REVISION' && usuario.rolNombre !== 'ADMINISTRADOR') {
    throw new AppError('Solo se pueden evaluar prácticas que se encuentren en estado EN_REVISION', 400, CODIGOS_ERROR.TRANSICION_ESTADO_INVALIDA);
  }

  return practicasRepository.crearRevisionConObservaciones({
    practicaId,
    docenteId: usuario.id,
    resultado: datos.resultado,
    comentariosGenerales: datos.comentariosGenerales || null,
    observaciones: datos.observaciones || []
  });
}

export async function obtenerRevisionesDePractica(practicaId, usuario) {
  await obtenerPracticaDetalle(practicaId, usuario);
  return practicasRepository.listarRevisionesPorPractica(practicaId);
}
