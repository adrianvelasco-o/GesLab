import * as documentosService from './documentos.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

export async function subir(req, res, next) {
  try {
    const { practicaId, tipo } = req.body;
    const nuevoDocumento = await documentosService.registrarDocumentoPdf({
      practicaId,
      tipo,
      archivo: req.file,
      usuario: req.usuario
    });
    return responderExito(res, 201, 'Documento PDF subido exitosamente', nuevoDocumento);
  } catch (error) {
    next(error);
  }
}

export async function listarPorPractica(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const documentos = await documentosService.obtenerDocumentosDePractica(practicaId, req.usuario);
    return responderExito(res, 200, 'Documentos de la práctica obtenidos correctamente', documentos);
  } catch (error) {
    next(error);
  }
}
