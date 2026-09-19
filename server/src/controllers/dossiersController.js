import { db } from '../store/db.js';

export const getAllDossiers = (req, res) => {
  const { type, status, search, limit = 50, offset = 0 } = req.query;
  const result = db.getDossiers({ type, status, search, limit, offset });
  return res.json({
    success: true,
    total: result.total,
    count: result.dossiers.length,
    data: result.dossiers
  });
};

export const getDossierById = (req, res) => {
  const { id } = req.params;
  const dossier = db.getDossierById(id);
  if (!dossier) {
    return res.status(404).json({ success: false, error: 'Dossier not found' });
  }
  return res.json({
    success: true,
    data: dossier
  });
};
