import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`
=====================================================
  LAXMI NIWAS VERIFICATION ENGINE — BACKEND READY
  Host:        ${HOST}
  Port:        ${PORT}
  Environment: ${process.env.NODE_ENV || 'production'}
  Status:      OPERATIONAL & CERTIFIED
=====================================================
  `);
});

server.on('error', (err) => {
  console.error('Server failed to start:', err);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
