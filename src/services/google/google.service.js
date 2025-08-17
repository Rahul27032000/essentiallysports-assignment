import { ENVIRONMENT } from "../../config/config.js";
import { AxiosError } from "axios";
import { GoogleProvider } from "./googleProvider.js";
import { APIGenericError } from "../../errorHandlers/APIErrorHandler.js";

export const publishArticleToGoogle = async (article, config) => {
  if (ENVIRONMENT === "staging" || ENVIRONMENT === "dev") {
    return { message: "Dummy Google publish success", article };
  }
  const res = await GoogleProvider.post(article, "/news/publish", config);
  return res;
};
