import { ENVIRONMENT } from "../../config/config.js";
import { AxiosError } from "axios";
import { MSNProvider } from "./msnProvider.js";
import { APIGenericError } from "../../errorHandlers/APIErrorHandler.js";

export const publishArticleToMSN = async (article, config) => {
  if (ENVIRONMENT === "staging" || ENVIRONMENT === "dev") {
    return { message: "Dummy MSN publish success", article };
  }

  const res = await MSNProvider.post(article, "/publish", config);
  return res;
};
