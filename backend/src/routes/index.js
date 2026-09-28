import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usuariosRoutes from '../modules/usuarios/usuarios.routes.js';
import practicasRoutes from '../modules/practicas/practicas.routes.js';
import documentosRoutes from '../modules/documentos/documentos.routes.js';
import reservasRoutes from '../modules/reservas/reservas.routes.js';
import tareasRoutes from '../modules/tareas/tareas.routes.js';
import pretestsRoutes from '../modules/pretests/pretests.routes.js';

const router = Router();

// Endpoint de verificación de estado del backend
router.get('/salud', (_req, res) => {
  res.json({
    exito: true,
    mensaje: 'El backend de GesLab está en ejecución y respondiendo correctamente.',
    timestamp: new Date().toISOString()
  });
});

// Rutas de los módulos del sistema
router.use('/autenticacion', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/practicas', practicasRoutes);
router.use('/documentos', documentosRoutes);
router.use('/reservas', reservasRoutes);
router.use('/tareas', tareasRoutes);
router.use('/pretests', pretestsRoutes);

export default router;