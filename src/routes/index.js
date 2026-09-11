import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usuariosRoutes from '../modules/usuarios/usuarios.routes.js';
import practicasRoutes from '../modules/practicas/practicas.routes.js';
import documentosRoutes from '../modules/documentos/documentos.routes.js';
import reservasRoutes from '../modules/reservas/reservas.routes.js';

const router = Router();

router.use('/autenticacion', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/practicas', practicasRoutes);
router.use('/documentos', documentosRoutes);
router.use('/reservas', reservasRoutes);

export default router;
