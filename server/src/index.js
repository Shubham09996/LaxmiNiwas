import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
=====================================================
  LAXMI NIWAS VERIFICATION ENGINE — BACKEND READY
  Port:        http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Status:      OPERATIONAL & CERTIFIED
=====================================================
  `);
});
