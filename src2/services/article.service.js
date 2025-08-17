import { getActivePartners } from "../utils/partners.js";
import { validateRequiredFields } from "../utils/validateRequiredFields.js";
import { createAuditLog } from "../utils/auditLogger.js";
import { PROVIDER_HANDLERS } from "../config/constants/providerConfig.js";
import { APIGenericError } from "../utils/errors.js";

export const primaryProcessingService = async (article) => {
  const partners = await getActivePartners();
  const allErrors = [];

  for (const partner of partners) {
    const { codeName, config, validationConfig } = partner;
    const partnerErrors = [];

    try {
      // ✅ Required fields
      if (validationConfig?.requiredFields?.length > 0) {
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

      // ✅ Prohibited words
      if (validationConfig?.prohibitedWords?.length > 0) {
        const found = validationConfig.prohibitedWords.filter((word) =>
          article.body.includes(word)
        );
        if (found.length > 0) {
          partnerErrors.push(`Prohibited words found: ${found.join(", ")}`);
        }
      }

      // ✅ Final decision for this partner
      if (partnerErrors.length === 0) {
        // Success case
        await createAuditLog({
          articleId: article.id,
          partnerCode: codeName,
          statusCode: 200,
          log: { message: "Content published successfully" },
          status: "SUCCESS",
        });
      } else {
        // Failure case → send all errors in one JSON
        allErrors.push({ partner: codeName, errors: partnerErrors });

        const handler = PROVIDER_HANDLERS[codeName.toLowerCase()];
        if (!handler) {
          throw new APIGenericError(
            "NO_HANDLER",
            500,
            `No handler found for provider: ${codeName}`
          );
        }

        await handler("article", article, config);

        await createAuditLog({
          articleId: article.id,
          partnerCode: codeName,
          statusCode: 400,
          log: { errors: partnerErrors },
          status: "FAILED",
        });
      }
    } catch (err) {
      // Catch runtime errors
      allErrors.push({ partner: codeName, errors: [err.message] });

      await createAuditLog({
        articleId: article.id,
        partnerCode: codeName,
        statusCode: 500,
        log: { errors: [err.message] },
        status: "FAILED",
      });
    }
  }

  // Final response
  if (allErrors.length > 0) {
    return { success: false, errors: allErrors };
  }

  return { success: true, message: "Article processed for all partners" };
};
