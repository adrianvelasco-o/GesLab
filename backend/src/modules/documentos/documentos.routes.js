import { Router } from 'express';
import * as documentosController from './documentos.controller.js';
import { autenticar } from '../../middlewares/autenticacion.js';
import { subirPdf } from '../../middlewares/subidaArchivos.js';
import { validarEsquema } from '../../middlewares/validarEsquema.js';
import {
  subirDocumentoEsquema,
  parametroIdPracticaEsquema,
  parametroIdDocumentoEsquema
} from './documentos.schema.js';

const router = Router();

router.use(autenticar);

// POST /api/documentos (multipart/form-data con archivo PDF validado por Zod)
router.post(
  '/',
  subirPdf.single('archivo'),
  validarEsquema(subirDocumentoEsquema, 'body'),
  documentosController.subir
);

// GET /api/documentos/practica/:id
router.get(
  '/practica/:id',
  validarEsquema(parametroIdPracticaEsquema, 'params'),
  documentosController.listarPorPractica
);

// GET /api/documentos/:id/descargar (Descarga / visualización segura de documento)
router.get(
  '/:id/descargar',
  validarEsquema(parametroIdDocumentoEsquema, 'params'),
  documentosController.descargar
);

// GET /api/documentos/:id/archivo (Alias para descarga)
router.get(
  '/:id/archivo',
  validarEsquema(parametroIdDocumentoEsquema, 'params'),
  documentosController.descargar
);

export default router;
