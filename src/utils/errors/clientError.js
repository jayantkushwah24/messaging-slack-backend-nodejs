import { StatusCodes } from "http-status-codes";

class clientError extends Error {
  constructor(error) {
    super(error.message);
    this.name = "ClientError";
    this.explanation = error.explanation ?? error.explaination;
    this.statusCode = error.statusCode
      ? error.statusCode
      : StatusCodes.BAD_REQUEST;
  }
}

export default clientError;
