import { Router } from 'express';
import * as documentosController from './documentos.controller.js';
import { autenticar } from '../../middlewares/autenticacion.js';
import { subirPdf } from '../../middlewares/subidaArchivos.js';

const router = Router();

// ⚠️ Comentado temporalmente para permitir pruebas en frontend sin enviar Token JWT
// router.use(autenticar);

// Soporta tanto POST /api/documentos/subir como POST /api/documentos
router.post('/subir', subirPdf.single('archivo'), documentosController.subir);
router.post('/', subirPdf.single('archivo'), documentosController.subir);

// GET /api/documentos/practica/:id
router.get('/practica/:id', documentosController.listarPorPractica);

export default router;