import express from 'express';
import { getAllDossiers, getDossierById } from '../controllers/dossiersController.js';

const router = express.Router();

router.get('/', getAllDossiers);
router.get('/:id', getDossierById);

export default router;
