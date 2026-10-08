import { Router } from 'express';
import * as notificacionesController from './notificaciones.controller.js';
import { autenticar } from '../../middlewares/autenticacion.js';
import { validarEsquema } from '../../middlewares/validarEsquema.js';
import { registrarDispositivoEsquema } from './notificaciones.schema.js';

const router = Router();

// Todas las rutas de notificaciones requieren estar autenticado
router.use(autenticar);

// Historial y estado de notificaciones
router.get('/', notificacionesController.listar);
router.get('/no-leidas', notificacionesController.obtenerNoLeidas);
router.patch('/marcar-todas-leidas', notificacionesController.marcarTodasLeidas);
router.patch('/:id/leida', notificacionesController.marcarLeida);

// Registro y eliminación de dispositivos FCM
router.post(
  '/dispositivos',
  validarEsquema(registrarDispositivoEsquema, 'body'),
  notificacionesController.registrarDispositivo
);

router.delete('/dispositivos/:token', notificacionesController.eliminarDispositivo);

export default router;
