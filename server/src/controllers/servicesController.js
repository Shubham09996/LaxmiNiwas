import { db } from '../store/db.js';

export const getAllServices = (req, res) => {
  const services = db.getServices();
  return res.json({
    success: true,
    count: services.length,
    data: services
  });
};

export const getServiceById = (req, res) => {
  const { id } = req.params;
  const service = db.getServiceById(id);
  if (!service) {
    return res.status(404).json({ success: false, error: 'Verification service not found' });
  }
  return res.json({
    success: true,
    data: service
  });
};
