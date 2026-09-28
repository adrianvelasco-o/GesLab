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

  // VALIDACIÓN HU CU11 / RF14:
  // Si la práctica fue rechazada, validar que no queden observaciones pendientes (resuelta = false)
  if (practica.estado === 'RECHAZADA') {
    const pendientes = await practicasRepository.contarObservacionesPendientes(practicaId);
    if (pendientes > 0) {
      throw new AppError(
        `No se puede reenviar a revisión. Quedan ${pendientes} observación(es) sin resolver.`,
        400,
        CODIGOS_ERROR.TRANSICION_ESTADO_INVALIDA // O un código como REQUISITO_NO_CUMPLIDO / OPERACION_INVALIDA
      );
    }
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
//Marcar Observaciones Como resuelta
export async function marcarObservacionComoResuelta(observacionId, usuario) {
  const observacion = await practicasRepository.buscarObservacionPorId(observacionId);
  if (!observacion) {
    throw new AppError('La observación no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // Verificar que la observación pertenezca a una práctica del estudiante
  const practica = await practicasRepository.buscarPracticaPorId(observacion.practicaId);
  const esDuenio = practica && (practica.estudianteId === usuario.id || usuario.rolNombre === 'ADMINISTRADOR');
  if (!esDuenio) {
    throw new AppError('No tienes permisos para modificar esta observación', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return practicasRepository.actualizarEstadoObservacion(observacionId, true);
}

export async function obtenerRevisionesDePractica(practicaId, usuario) {
  await obtenerPracticaDetalle(practicaId, usuario);
  return practicasRepository.listarRevisionesPorPractica(practicaId);
}

export async function cerrarPracticaFormalmente(practicaId, usuario) {
  const practica = await practicasRepository.buscarPracticaPorId(Number(practicaId));

  if (!practica) {
    throw new AppError('La práctica solicitada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // 1. Validar permisos: Solo Docentes (o Administradores) pueden cerrar prácticas
  const esDocenteOAdmin = ['DOCENTE', 'ADMINISTRADOR'].includes(usuario.rolNombre);
  if (!esDocenteOAdmin) {
    throw new AppError('Solo un docente o administrador puede realizar el cierre formal de una práctica', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  // 2. Validar que si es un docente, sea el docente asignado a la práctica (o admin)
  if (usuario.rolNombre === 'DOCENTE' && practica.docenteId && practica.docenteId !== usuario.id) {
    throw new AppError('Solo el docente asignado a esta práctica puede cerrarla formalmente', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  // 3. Validar estado válido para el cierre (normalmente FINALIZADA o EN_EJECUCION)
  if (!['FINALIZADA', 'EN_EJECUCION', 'APROBADA'].includes(practica.estado)) {
    throw new AppError(
      `No se puede cerrar una práctica en estado ${practica.estado}. Debe haber finalizado su ejecución.`,
      400,
      CODIGOS_ERROR.TRANSICION_ESTADO_INVALIDA
    );
  }

  // 4. Cambiar estado a CERRADA
  return practicasRepository.cerrarPractica(Number(practicaId));
}
