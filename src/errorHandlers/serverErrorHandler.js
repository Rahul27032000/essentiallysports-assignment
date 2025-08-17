import { ENVIRONMENT } from "../config/config.js";
import BaseError from "./BaseError.js";
import { logIfNotProduction } from "../utils/logger.js";
import { sendResponse } from "../utils/help.js";

function isOperationalError(error) {
  return error instanceof BaseError && error.isOperational;
}

export const serverErrorHandler = (error, req, res, next) => {
  const isOp = error instanceof BaseError && error.isOperational;

  logIfNotProduction(`isOperationalError: ${isOp}`);

  if (["staging", "development", "local"].includes(ENVIRONMENT) && !isOp) {
    console.error("ERROR:", error);
  }

  let message = isOp ? error.message : "Internal Server Error";

  sendResponse(
    error.statusCode || 500,
    false,
    res, 
    null,
    error.errorCode || "E-0001",
    message
  );
};
