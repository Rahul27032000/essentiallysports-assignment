export const sendResponse = (
  httpCode,
  success,
  res,
  data = null,
  errorCode = null,
  errorMessage = null
) => {
  const error = {
    errorCode: errorCode || null,
    errorMessage: errorMessage || null,
  };

  const response = {
    error,
    data: data || null,
    success,
    message: success ? "SUCCESS" : "ERROR",
  };

  return res.status(httpCode).json(response);
};
