import { getActivePartners } from "../utils/partners.js";
import { validateRequiredFields } from "../utils/validateRequiredFields.js";
import { createAuditLog } from "../utils/auditLogger.js";
import { PROVIDER_HANDLERS } from "../config/constants/providerConfig.js";
import { APIGenericError } from "../utils/errors.js";

export const primaryProcessingService = async (article) => {
  const partners = await getActivePartners();

  for (const partner of partners) {
    const { codeName, config, validationConfig } = partner;
    const partnerErrors = [];

    // ✅ Required fields
    if (validationConfig?.requiredFields?.length) {
      try {
        validateRequiredFields(article, validationConfig.requiredFields);
      } catch (err) {
        partnerErrors.push(err.message);
      }
    }

    // ✅ Title length
    if (
      validationConfig?.titleLength &&
      (article.title.length < validationConfig.titleLength.min ||
        article.title.length > validationConfig.titleLength.max)
    ) {
      partnerErrors.push(
        `Title length must be between ${validationConfig.titleLength.min} and ${validationConfig.titleLength.max}`
      );
    }

    // ✅ Body length
    if (
      validationConfig?.bodyLength &&
      (article.body.length < validationConfig.bodyLength.min ||
        article.body.length > validationConfig.bodyLength.max)
    ) {
      partnerErrors.push(
        `Body length must be between ${validationConfig.bodyLength.min} and ${validationConfig.bodyLength.max}`
      );
    }

    // ✅ Prohibited words in title and body
    if (validationConfig?.prohibitedWords?.length) {
      const foundInTitle = validationConfig.prohibitedWords.filter((word) =>
        article.title.includes(word)
      );
      const foundInBody = validationConfig.prohibitedWords.filter((word) =>
        article.body.includes(word)
      );

      if (foundInTitle.length) {
        partnerErrors.push(`Prohibited words in title: ${foundInTitle.join(", ")}`);
      }
      if (foundInBody.length) {
        partnerErrors.push(`Prohibited words in body: ${foundInBody.join(", ")}`);
      }
    }

    // ✅ If there are validation errors → log and throw
    if (partnerErrors.length) {
      await createAuditLog({
        articleId: article.id,
        partnerCode: codeName,
        statusCode: 400,
        log: { errors: partnerErrors },
        status: "FAILED",
      });

      throw new APIGenericError(
        "VALIDATION_FAILED",
        400,
        `Validation failed for partner ${codeName}`,
        partnerErrors
      );
    }

    // ✅ Call provider handler
    const handler = PROVIDER_HANDLERS[codeName.toLowerCase()];
    if (!handler) {
      throw new APIGenericError(
        "NO_HANDLER",
        500,
        `No handler found for provider: ${codeName}`
      );
    }

    const result = await handler("article", article, config);

    // ✅ If provider call succeeds → log success
    await createAuditLog({
      articleId: article.id,
      partnerCode: codeName,
      statusCode: 200,
      log: { message: "Content published successfully", response: result },
      status: "SUCCESS",
    });
  }

  return { success: true, message: "Article processed for all partners" };
};
