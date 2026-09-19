import { db } from '../store/db.js';

export const getAuditLogs = (req, res) => {
  const { limit = 50, offset = 0, search } = req.query;
  const result = db.getAuditLogs({ limit, offset, search });
  return res.json({
    success: true,
    total: result.total,
    count: result.logs.length,
    data: result.logs
  });
};
