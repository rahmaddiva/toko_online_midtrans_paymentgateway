// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Midtrans specific errors
  if (err.ApiResponse) {
    statusCode = err.httpStatusCode || 500;
    message = err.ApiResponse.error_messages 
      ? err.ApiResponse.error_messages.join(', ') 
      : 'Midtrans API Error';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;