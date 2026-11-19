import { StatusCodes } from "http-status-codes";

class ValidationError extends Error {
  constructor(errorDetails, message) {
    super(message || "Validation error");
    this.name = "ValidationError";
    const errors = errorDetails?.error;
    this.explanation = Array.isArray(errors)
      ? errors
      : Object.values(errors || {}).map((error) =>
          typeof error === "string" ? error : error.message
        );
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default ValidationError;
