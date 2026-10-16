import { Router } from 'express';
import * as tareasController from './tareas.controller.js';
import { autenticar } from '../../middlewares/autenticacion.js';
import { permitirRoles } from '../../middlewares/autorizacion.js';
import { validarEsquema } from '../../middlewares/validarEsquema.js';
import { crearTareaEsquema, actualizarTareaEsquema, parametroIdTareaEsquema } from './tareas.schema.js';

const router = Router();

router.use(autenticar);

// Lectura: cualquier usuario autenticado
router.get('/', tareasController.listar);
router.get('/:id', validarEsquema(parametroIdTareaEsquema, 'params'), tareasController.obtener);

// Escritura: quienes diseñan pruebas (estudiante, docente, administrador)
router.post(
  '/',
  permitirRoles('ESTUDIANTE', 'DOCENTE', 'ADMINISTRADOR'),
  validarEsquema(crearTareaEsquema, 'body'),
  tareasController.crear
);
router.put(
  '/:id',
  permitirRoles('ESTUDIANTE', 'DOCENTE', 'ADMINISTRADOR'),
  validarEsquema(parametroIdTareaEsquema, 'params'),
  validarEsquema(actualizarTareaEsquema, 'body'),
  tareasController.actualizar
);

// Eliminación: solo docente o administrador
router.delete(
  '/:id',
  permitirRoles('DOCENTE', 'ADMINISTRADOR'),
  validarEsquema(parametroIdTareaEsquema, 'params'),
  tareasController.eliminar
);

export default router;
