import express from 'express';
import { getApiKeys, createApiKey, revokeApiKey } from '../controllers/apiKeysController.js';

const router = express.Router();

router.get('/', getApiKeys);
router.post('/', createApiKey);
router.delete('/:id', revokeApiKey);

export default router;
