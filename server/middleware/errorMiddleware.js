/**
 * 404 Not Found Middleware for unmatched API routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Safe Error Handling Middleware
 * 
 * Ensures:
 * - No internal stack traces, DB schemas, or sensitive keys leak to clients.
 * - Consistent HTTP status codes (400, 401, 403, 404, 422, 500).
 * - Technical details logged server-side only without credentials.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'An unexpected server error occurred. Please try again.';

  // Mongoose Bad ObjectId / CastError
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Requested resource not found.';
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'An account with these details already exists.';
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const firstMsg = Object.values(err.errors || {})[0]?.message;
    message = firstMsg || 'Invalid data provided.';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please sign in again.';
  }

  // Sanitize internal AI / Storage errors for client-facing response
  if (statusCode === 500) {
    // Log detailed server-side error for debugging
    console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err.message);
    
    // Provide clean, friendly message if error contains raw technical paths
    if (message.includes('ECONNREFUSED') || message.includes('buffering timed out') || message.includes('MongoServerSelectionError')) {
      message = 'Database connection temporarily unavailable. Please try again shortly.';
    } else if (message.includes('Vertex AI') || message.includes('Google Cloud')) {
      message = 'AI intelligence service is temporarily unavailable. Please try again.';
    } else if (message.includes('Supabase') || message.includes('storage')) {
      message = 'Storage service is temporarily unavailable. Please try again.';
    }
  }

  return res.status(statusCode).json({
    success: false,
    message
  });
};
