import { db } from '../store/db.js';

export const getMetrics = (req, res) => {
  const metrics = db.getMetrics();
  return res.json({
    success: true,
    data: metrics
  });
};
