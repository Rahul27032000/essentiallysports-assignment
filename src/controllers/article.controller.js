// controllers/article.controller.js
import { APIGenericError } from "../errorHandlers/APIErrorHandler.js";
import { primaryProcessingService } from "../services/article.service.js";
import { errorCodes, errorMessages } from "../utils/constants.js";

export const processArticleController = async (req, res, next) => {
  try {
    const { articleId, title, body, author, category, thumbnail } = req.body;

    
    if (!articleId || !title || !body) {
      throw new APIGenericError(
        errorCodes.BAD_REQUEST.name,
        errorMessages.BAD_REQUEST.code,
        errorCodes.BAD_REQUEST.code,
        `${errorCodes.BAD_REQUEST.message} articleId, title, body`
      );
    }

    const result = await primaryProcessingService({
      articleId,
      title,
      body,
      author,
      category,
      thumbnail,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
