import { ENVIRONMENT } from "../../config/config.js";
import { AxiosError } from "axios";
import { GoogleProvider } from "./googleProvider.js";
import { APIGenericError } from "../../errorHandlers/APIErrorHandler.js";

export const publishArticleToGoogle = async (article, config) => {
  if (ENVIRONMENT === "staging" || ENVIRONMENT === "dev") {
    return { message: "Dummy Google publish success", article };
  }

  try {
    const res = await GoogleProvider.post(article, "/news/publish", config);
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIGenericError(
        error.code,
        error.response?.status || 500,
        `Google API Error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Unexpected Google error");
  }
};
