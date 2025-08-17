// controllers/article.controller.js
import { APIGenericError } from "../errorHandlers/APIErrorHandler.js";
import { feedProcessingService, primaryProcessingService } from "../services/article.service.js";
import { errorCodes, errorMessages } from "../utils/constants.js";

export const processArticleControllerForAllProviders = async (req, res, next) => {
  // try {
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
  // } catch (err) {
  //   next(err);
  // }
};


export const processArticleController = async (req, res, next) => {
  
    const { article,feed } = req.body;
    const {articleId, title, body, author, category, thumbnail} =article

    // console.log(articleId,title,body,)
    
    if (!articleId || !title || !body || !feed) {
      throw new APIGenericError(
        errorCodes.BAD_REQUEST.name,
        errorMessages.BAD_REQUEST.code,
        errorCodes.BAD_REQUEST.code,
        `${errorCodes.BAD_REQUEST.message} articleId, title, body,feed`
      );
    }

    const result = await feedProcessingService({
      articleId,
      title,
      body,
      author,
      category,
      thumbnail,
    },feed);

    return res.status(200).json({
      success: true,
      data: result,
    });
  // } catch (err) {
  //   next(err);
  // }
};