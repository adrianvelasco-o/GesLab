import { Router } from 'express';
import { autenticar } from '../../middlewares/autenticacion.js';
import * as authService from '../auth/auth.service.js';
import { responderExito } from '../../utils/respuestaApi.js';

const router = Router();

router.use(autenticar);

// GET /api/usuarios/me
router.get('/me', async (req, res, next) => {
  try {
    const usuario = await authService.obtenerPerfil(req.usuario.id);
    return responderExito(res, 200, 'Datos del usuario autenticado obtenidos correctamente', usuario);
  } catch (error) {
    next(error);
  }
});

export default router;
