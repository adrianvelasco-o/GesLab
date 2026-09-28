import { Router } from 'express';
import * as reservasController from './reservas.controller.js';
import { autenticar } from '../../middlewares/autenticacion.js';
import { permitirRoles } from '../../middlewares/autorizacion.js';
import { validarEsquema } from '../../middlewares/validarEsquema.js';
import { crearReservaEsquema, rechazarReservaEsquema } from './reservas.schema.js';

const router = Router();

router.use(autenticar);

// Catálogo de laboratorios y horarios disponibles (CU12)
router.get('/laboratorios', reservasController.listarLaboratorios);

// Endpoints generales de reservas
router.post('/', validarEsquema(crearReservaEsquema, 'body'), reservasController.crear);
router.get('/', reservasController.listar);
router.get('/:id', reservasController.obtenerPorId);

// Endpoints administrativos de aprobación y rechazo
router.patch(
  '/:id/aprobar',
  permitirRoles('ENCARGADO', 'ADMINISTRADOR'),
  reservasController.aprobar
);

router.patch(
  '/:id/rechazar',
  permitirRoles('ENCARGADO', 'ADMINISTRADOR'),
  validarEsquema(rechazarReservaEsquema, 'body'),
  reservasController.rechazar
);

// Endpoint CU12 / RF18
router.get('/disponibilidad', reservasController.obtenerDisponibilidad);

export default router;
