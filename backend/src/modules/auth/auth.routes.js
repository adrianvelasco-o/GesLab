import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validarEsquema } from '../../middlewares/validarEsquema.js';
import { loginEsquema, registroEsquema } from './auth.schema.js';
import { autenticar } from '../../middlewares/autenticacion.js';
import { limitadorLogin, limitadorRegistro } from '../../middlewares/limitadorTasa.js';

const router = Router();

// POST /api/autenticacion/registro
router.post('/registro', limitadorRegistro, validarEsquema(registroEsquema, 'body'), authController.register);

// POST /api/autenticacion/iniciar-sesion (con protección anti fuerza bruta)
router.post('/iniciar-sesion', limitadorLogin, validarEsquema(loginEsquema, 'body'), authController.login);

// Alias para compatibilidad de clientes: POST /api/autenticacion/login
router.post('/login', limitadorLogin, validarEsquema(loginEsquema, 'body'), authController.login);

// GET /api/autenticacion/perfil
router.get('/perfil', autenticar, authController.obtenerMiPerfil);

export default router;
