import { Router } from 'express';
import * as controller from './tareas.controller.js';

const router = Router();

router.get('/', controller.getTareas);
router.post('/', controller.createTarea);
router.put('/:id', controller.updateTarea);
router.delete('/:id', controller.deleteTarea);

export default router;