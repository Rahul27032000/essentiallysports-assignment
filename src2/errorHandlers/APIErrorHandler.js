import BaseError from "./BaseError.js";


export class APIGenericError extends BaseError {
  constructor(name, errorCode, statusCode, description, isOperational = true) {
    super(name, errorCode, statusCode, isOperational, description);
  }
}
