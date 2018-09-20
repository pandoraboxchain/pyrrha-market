import express from 'express';
import * as controller from './workers.controller';
const router = express.Router();

router.get('/', controller.getWorkers);
router.get('/count', controller.getWorkerNodesCount);
router.get('/:id', controller.getWorkerById);
router.get('/address/:address', controller.getWorkerByAddress);

export default router;
