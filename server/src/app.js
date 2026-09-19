import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import verificationRoutes from './routes/verificationRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import dossiersRoutes from './routes/dossiersRoutes.js';
import apiKeysRoutes from './routes/apiKeysRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security & Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Laxmi Niwas Verification Engine',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime()
  });
});

// API Routes
app.use('/api/verify', verificationRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/dossiers', dossiersRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

export default app;
