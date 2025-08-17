import { ENVIRONMENT } from "../config/config.js";
import { sendResponse } from "../utils/sendResponse.js";
import BaseError from "./BaseError.js";


function isOperationalError(error) {
  return error instanceof BaseError && error.isOperational;
}

export const serverErrorHandler = (error, req, res, next) => {
  const isOp = error instanceof BaseError && error.isOperational;


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
