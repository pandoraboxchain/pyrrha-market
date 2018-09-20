import express from 'express';
import * as controller from './system.controller';
const router = express.Router();

router.get('/version', controller.getVersion);
router.get('/addresses', controller.getAddresses);
router.get('/runtime', controller.getRuntimeProperties);
router.get('/state', controller.getState);

// @todo Remove or secure these API endpoints on production
router.post('/reset/baseline', controller.resetBaseline);
router.post('/reset/baseline/:id', controller.resetBaseline);
router.get('/loglevel', controller.getLogLevel);
router.post('/loglevel/:level', controller.setLogLevel);
router.get('/subscriptions', controller.getSubscriptionsList);

export default router;
