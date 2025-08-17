
import { ENVIRONMENT } from "../../config/config.js";
import { AxiosError } from "axios";
import { MSNProvider } from "./msnProvider.js";
import { APIGenericError } from "../../errorHandlers/APIErrorHandler.js";

export const publishArticleToMSN = async (article, config) => {
  if (ENVIRONMENT === "staging" || ENVIRONMENT === "dev") {
    return { message: "Dummy MSN publish success", article };
  }

  try {
    const res = await MSNProvider.post(article, "/publish", config);
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIGenericError(
        error.code,
        error.response?.status || 500,
        `MSN API Error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Unexpected MSN error");
  }
};
