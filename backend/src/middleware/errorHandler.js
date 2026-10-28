export default function errorHandler(error, _request, response, _next) {
  if (response.headersSent) {
    return;
  }

  if (error?.code === 11000) {
    return response.status(409).json({
      error: { message: "A record with these unique values already exists." },
    });
  }

  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return response.status(400).json({
      error: { message: error.message },
    });
  }

  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : Number.isInteger(error.status)
      ? error.status
      : 500;

  if (statusCode >= 500) {
    console.error("Unhandled API error:", error);
  }

  response.status(statusCode).json({
    error: {
      message:
        statusCode >= 500
          ? "An unexpected server error occurred."
          : error.message,
    },
  });
}
