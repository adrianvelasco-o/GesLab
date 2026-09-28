import { Router } from 'express';
import * as controller from './pretests.controller.js';

const router = Router();

router.get('/', controller.getPretests);
router.post('/', controller.createPretest);
router.put('/:id', controller.updatePretest);
router.delete('/:id', controller.deletePretest);

export default router;