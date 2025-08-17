export const validateRequiredFields = (fieldsArray, fields) => {
  const missingFields = fields?.filter(
    (field) =>
      fieldsArray[field] === null ||
      fieldsArray[field] === undefined ||
      fieldsArray[field] === "" ||
      fieldsArray[field] === "null" ||
      fieldsArray[field] === "undefined"
  );
  if (missingFields.length > 0) {
    throw new APIGenericError(
      errorCodes.BAD_REQUEST.name,
      errorMessages.BAD_REQUEST.code,
      errorCodes.BAD_REQUEST.code,
      `${errorCodes.BAD_REQUEST.message} ${missingFields.toString()}`
    );
  }
};