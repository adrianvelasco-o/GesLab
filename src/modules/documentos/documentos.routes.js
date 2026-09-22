import { Router } from 'express';
import * as documentosController from './documentos.controller.js';
import { autenticar } from '../../middlewares/autenticacion.js';
import { subirPdf } from '../../middlewares/subidaArchivos.js';

const router = Router();

router.use(autenticar);

// POST /api/documentos (multipart/form-data con archivo PDF)
router.post('/', subirPdf.single('archivo'), documentosController.subir);

// GET /api/practicas/:id/documentos
router.get('/practica/:id', documentosController.listarPorPractica);

export default router;
