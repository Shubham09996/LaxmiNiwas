export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);

  const statusCode = err.statusCode || (err.message && err.message.includes('Invalid') ? 400 : 500);
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
