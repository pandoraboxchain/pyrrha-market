import express from 'express';
import * as controller from './datasets.controller';
const router = express.Router();

router.get('/', controller.getDatasets);
router.get('/address/:address', controller.getDatasetByAddress);

export default router;
