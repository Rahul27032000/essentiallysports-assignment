export const errorCodes = {
  BAD_REQUEST: {
    name: "BAD_REQUEST",
    code: 400,
    message: "Bad Request",
  },
  INTERNAL_SERVER_ERROR: {
    name: "INTERNAL_SERVER_ERROR",
    code: 500,
    message: "Something went wrong",
  },
  NOT_FOUND: {
    name: "NOT_FOUND",
    code: 404,
    message: "Resource not found",
  },
};

export const errorMessages = {
  BAD_REQUEST: {
    code: "Missing required fields",
  },
  INTERNAL_SERVER_ERROR: {
    code: "Unexpected server error",
  },
  NOT_FOUND: {
    code: "Requested resource not found",
  },
};
