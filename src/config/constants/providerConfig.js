import { publishArticleToGoogle } from "../../services/google/google.service.js";
import { publishArticleToMSN } from "../../services/msn/msn.service.js";

export const PROVIDER_HANDLERS = {
  google: async (payload, config) => {
    return await publishArticleToGoogle(payload, config);
  },
  msn: async (payload, config) => {
    return await publishArticleToMSN(payload, config);
  },
};
