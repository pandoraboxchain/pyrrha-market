import express from 'express';
import * as controller from './jobs.controller';
const router = express.Router();

router.get('/', controller.getJobs);
router.get('/address/:address', controller.getJobByAddress); 

export default router;
