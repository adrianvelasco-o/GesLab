import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usuariosRoutes from '../modules/usuarios/usuarios.routes.js';
import practicasRoutes from '../modules/practicas/practicas.routes.js';
import documentosRoutes from '../modules/documentos/documentos.routes.js';
import reservasRoutes from '../modules/reservas/reservas.routes.js';
import notificacionesRoutes from '../modules/notificaciones/notificaciones.routes.js';
import { responderExito } from '../utils/respuestaApi.js';

const router = Router();

router.get('/salud', (_req, res) => {
  return responderExito(res, 200, 'Servidor GesLab operando correctamente', {
    estado: 'OK',
    timestamp: new Date().toISOString()
  });
});

router.use('/autenticacion', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/practicas', practicasRoutes);
router.use('/documentos', documentosRoutes);
router.use('/reservas', reservasRoutes);
router.use('/notificaciones', notificacionesRoutes);

export default router;
