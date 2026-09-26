const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === '23505') {
    statusCode = 409;
    message = 'Conflict: Duplicate value exists';
  }

  if (err.code === 'PGRST205') {
    statusCode = 503;
    message = 'Database schema is not ready. Run supabase_schema.sql in the Supabase project configured by SUPABASE_URL, then retry.';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
