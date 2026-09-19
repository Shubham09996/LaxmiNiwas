import { db } from '../store/db.js';

export const getApiKeys = (req, res) => {
  const keys = db.getApiKeys();
  return res.json({
    success: true,
    data: keys
  });
};

export const createApiKey = (req, res) => {
  const { name, environment, rateLimitRps, permissions, webhookUrl } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Key name / description is required' });
  }

  const key = db.createApiKey({ name, environment, rateLimitRps, permissions, webhookUrl });
  return res.status(201).json({
    success: true,
    message: 'API Key generated successfully',
    data: key
  });
};

export const revokeApiKey = (req, res) => {
  const { id } = req.params;
  const success = db.revokeApiKey(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'API key not found' });
  }
  return res.json({
    success: true,
    message: 'API key revoked successfully'
  });
};
