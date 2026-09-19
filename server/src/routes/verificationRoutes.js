import express from 'express';
import {
  getApiStages,
  runApiTest,
  runServiceByName,
  previewMasterPayload
} from '../controllers/verificationController.js';

const router = express.Router();

router.get('/stages', getApiStages);
router.post('/test', runApiTest);
router.post('/preview-master', previewMasterPayload);
router.post('/:service', runServiceByName);

export default router;
