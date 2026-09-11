import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validarEsquema } from '../../middlewares/validarEsquema.js';
import { loginEsquema, registroEsquema } from './auth.schema.js';
import { autenticar } from '../../middlewares/autenticacion.js';

const router = Router();

// POST /api/autenticacion/registro
router.post('/registro', validarEsquema(registroEsquema, 'body'), authController.register);

// POST /api/autenticacion/iniciar-sesion
router.post('/iniciar-sesion', validarEsquema(loginEsquema, 'body'), authController.login);

// GET /api/autenticacion/perfil
router.get('/perfil', autenticar, authController.obtenerMiPerfil);

export default router;
