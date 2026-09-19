import express from 'express';
import { getAllServices, getServiceById } from '../controllers/servicesController.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);

export default router;
