import { Router } from 'express';
import * as practicasController from './practicas.controller.js';
import { autenticar } from '../../middlewares/autenticacion.js';
import { permitirRoles } from '../../middlewares/autorizacion.js';
import { validarEsquema } from '../../middlewares/validarEsquema.js';
import {
  crearPracticaEsquema,
  actualizarPracticaEsquema,
  crearInstrumentoEsquema,
  revisionDocenteEsquema
} from './practicas.schema.js';

const router = Router();

// Todas las rutas de prácticas requieren autenticación
router.use(autenticar);

// CRUD de Prácticas
router.post('/', validarEsquema(crearPracticaEsquema, 'body'), practicasController.crear);
router.get('/', practicasController.listar);
router.get('/:id', practicasController.obtenerPorId);
router.put('/:id', validarEsquema(actualizarPracticaEsquema, 'body'), practicasController.actualizar);

// Transiciones de estado de la práctica
router.patch('/:id/enviar-revision', practicasController.enviarRevision);

// Gestión de Instrumentos de Evaluación (CU07 / HU04)
router.post(
  '/:id/instrumentos',
  validarEsquema(crearInstrumentoEsquema, 'body'),
  practicasController.crearInstrumento
);
router.get('/:id/instrumentos', practicasController.listarInstrumentos);
router.delete('/:id/instrumentos/:instrumentoId', practicasController.eliminarInstrumento);

// Revisiones y Observaciones Docentes (CU10 / HU07)
router.post(
  '/:id/revisiones',
  permitirRoles('DOCENTE', 'ADMINISTRADOR'),
  validarEsquema(revisionDocenteEsquema, 'body'),
  practicasController.registrarRevision
);
router.get('/:id/revisiones', practicasController.listarRevisiones);

// Marcar Observación como resuelta (CU11 / HU14)
router.patch('/observaciones/:id/resolver', practicasController.resolverObservacion);

export default router;