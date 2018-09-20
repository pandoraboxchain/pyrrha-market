import express from 'express';
import * as controller from './kernels.controller';
const router = express.Router();

router.get('/', controller.getKernels);
router.get('/address/:address', controller.getKernelByAddress);

export default router;
