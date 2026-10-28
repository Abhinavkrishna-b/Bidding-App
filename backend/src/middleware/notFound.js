export default function notFound(request, response, next) {
  if (response.headersSent) {
    return next();
  }

  response.status(404).json({
    error: {
      message: `Route not found: ${request.method} ${request.originalUrl}`,
    },
  });
}
