import * as documentosRepository from './documentos.repository.js';
import * as practicasRepository from '../practicas/practicas.repository.js';
import { AppError } from '../../errors/AppError.js';
import { CODIGOS_ERROR } from '../../constants/codigosError.js';

export async function registrarDocumentoPdf({ practicaId, tipo, archivo, usuario }) {
  if (!archivo) {
    throw new AppError('Debe adjuntar un archivo en formato PDF', 400, CODIGOS_ERROR.DATOS_INVALIDOS);
  }

  const idNum = parseInt(practicaId, 10);
  if (isNaN(idNum)) {
    throw new AppError('El practicaId debe ser un número entero válido', 400, CODIGOS_ERROR.DATOS_INVALIDOS);
  }

  // 1. Verificar que la práctica exista
  const practica = await practicasRepository.buscarPracticaPorId(idNum);
  if (!practica) {
    throw new AppError('La práctica especificada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  // 2. Verificar permisos: El estudiante debe ser el dueño de la práctica (o admin)
  const puedeSubir =
    ['ADMINISTRADOR', 'ENCARGADO'].includes(usuario.rolNombre) ||
    practica.estudianteId === usuario.id;

  if (!puedeSubir) {
    throw new AppError('No tienes permisos para adjuntar documentos a esta práctica', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  // 3. Guardar metadatos en PostgreSQL
  return documentosRepository.crearDocumento({
    practicaId: idNum,
    subidoPorUsuarioId: usuario.id,
    tipo: tipo || 'CONSENTIMIENTO_INFORMADO',
    nombreOriginal: archivo.originalname,
    nombreAlmacenamiento: archivo.filename,
    ruta: archivo.path.replace(/\\/g, '/'),
    tipoMime: archivo.mimetype,
    tamanoBytes: archivo.size
  });
}

export async function obtenerDocumentosDePractica(practicaId, usuario) {
  const idNum = parseInt(practicaId, 10);
  const practica = await practicasRepository.buscarPracticaPorId(idNum);

  if (!practica) {
    throw new AppError('La práctica especificada no existe', 404, CODIGOS_ERROR.RECURSO_NO_ENCONTRADO);
  }

  const tienePermiso =
    ['ADMINISTRADOR', 'ENCARGADO', 'DOCENTE'].includes(usuario.rolNombre) ||
    practica.estudianteId === usuario.id;

  if (!tienePermiso) {
    throw new AppError('No tienes permisos para consultar los documentos de esta práctica', 403, CODIGOS_ERROR.ACCESO_DENEGADO);
  }

  return documentosRepository.listarDocumentosPorPracticaId(idNum);
}
