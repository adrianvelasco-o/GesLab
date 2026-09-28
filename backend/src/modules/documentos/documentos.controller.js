import * as documentosService from './documentos.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

export async function subir(req, res, next) {
  try {
    const { practicaId, tipo } = req.body;

    // Fallback de usuario id = 1 para pruebas sin autenticación
    const usuarioActual = req.usuario || { id: 1 };

    // Usa el tipo enviado o asigna REPORTE_FINAL (valor exacto de schema.prisma)
    const tipoDocumento = tipo || 'REPORTE_FINAL';

    const nuevoDocumento = await documentosService.registrarDocumentoPdf({
      practicaId: parseInt(practicaId, 10),
      tipo: tipoDocumento,
      archivo: req.file,
      usuario: usuarioActual
    });

    return responderExito(res, 201, 'Documento PDF subido exitosamente', nuevoDocumento);
  } catch (error) {
    next(error);
  }
}

export async function listarPorPractica(req, res, next) {
  try {
    const practicaId = parseInt(req.params.id, 10);
    const usuarioActual = req.usuario || { id: 1 };

    const documentos = await documentosService.obtenerDocumentosDePractica(practicaId, usuarioActual);
    return responderExito(res, 200, 'Documentos de la práctica obtenidos correctamente', documentos);
  } catch (error) {
    next(error);
  }
}