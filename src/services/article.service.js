import { createAuditLog } from "../utils/auditLogger.js";
import { PROVIDER_HANDLERS } from "../config/constants/providerConfig.js";
import { APIGenericError } from "../errorHandlers/APIErrorHandler.js";
import { getActivePartners } from "../utils/partnerUtils.js";
import { validateRequiredFields } from "../validators/fieldValitors.js";
import { sendToTeams } from "./sendToTeams.js";

export const primaryProcessingService = async (article) => {
  const results = {
    success: [],
    failed: [],
  };

  const partners = await getActivePartners();

  for (const partner of partners) {
    const { code: partnerCode, config, validationConfig } = partner;
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

    // ✅ Prohibited words
    if (validationConfig?.prohibitedWords?.length) {
      const foundInTitle = validationConfig.prohibitedWords.filter((word) =>
        article.title.includes(word)
      );
      const foundInBody = validationConfig.prohibitedWords.filter((word) =>
        article.body.includes(word)
      );

      if (foundInTitle.length) {
        partnerErrors.push(
          `Prohibited words in title: ${foundInTitle.join(", ")}`
        );
      }
      if (foundInBody.length) {
        partnerErrors.push(
          `Prohibited words in body: ${foundInBody.join(", ")}`
        );
      }
    }

    // ✅ Handle errors per partner
    if (partnerErrors.length) {
      await createAuditLog({
        articleId: article.articleId,
        partnerCode,
        statusCode: 400,
        log: { errors: partnerErrors },
        status: "REJECTED",
      });

      await sendToTeams({
        articleId: article.articleId,
        title: article.title,
        errors: partnerErrors,
      });

      results.failed.push({
        partner: partnerCode,
        errors: partnerErrors,
      });

      continue; // 🚀 Skip to next partner instead of throwing
    }

    // ✅ Call provider handler
    const handler = PROVIDER_HANDLERS[partnerCode.toLowerCase()];
    if (!handler) {
      const errorMsg = `No handler found for provider: ${partnerCode}`;

      await createAuditLog({
        articleId: article.articleId,
        partnerCode,
        statusCode: 500,
        log: { error: errorMsg },
        status: "FAILED",
      });

      results.failed.push({
        partner: partnerCode,
        errors: [errorMsg],
      });

      continue;
    }

    try {
      const result = await handler("article", article, config);

      await createAuditLog({
        articleId: article.articleId,
        partnerCode,
        statusCode: 200,
        log: { message: "Content published successfully", response: result },
        status: "PUBLISHED",
      });

      results.success.push(partnerCode);
    } catch (err) {
      await createAuditLog({
        articleId: article.articleId,
        partnerCode,
        statusCode: 500,
        log: { error: err.message },
        status: "REJECTED",
      });

      results.failed.push({
        partner: partnerCode,
        errors: [err.message],
      });
    }
  }

  return {
    success: results.success,
    failed: results.failed,
    message: `Processed article for ${results.success.length} success and ${results.failed.length} failed partners`,
  };
};

export const feedProcessingService = async (article, feed) => {
  const partnerCode = feed?.partnerCode;
  if (!partnerCode) {
    throw new APIGenericError(
      "INVALID_FEED",
      400,
      "Partner code is required in feed"
    );
  }

  // 🔍 Find the partner from active partners
  const partners = await getActivePartners();
  const partner = partners.find(
    (p) => p.code.toLowerCase() === partnerCode.toLowerCase()
  );

  if (!partner) {
    throw new APIGenericError(
      "PARTNER_NOT_FOUND",
      404,
      `No active partner found with code: ${partnerCode}`
    );
  }

  const { config, validationConfig } = partner;
  const partnerErrors = [];

  // ✅ Required fields validation
  if (validationConfig?.requiredFields?.length) {
    try {
      validateRequiredFields(article, validationConfig.requiredFields);
    } catch (err) {
      partnerErrors.push(err.message);
    }
  }

  // ✅ Title length validation
  if (
    validationConfig?.titleLength &&
    (article.title.length < validationConfig.titleLength.min ||
      article.title.length > validationConfig.titleLength.max)
  ) {
    partnerErrors.push(
      `Title length must be between ${validationConfig.titleLength.min} and ${validationConfig.titleLength.max}`
    );
  }

  // ✅ Body length validation
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
  if (validationConfig?.prohibitedWords?.length) {
    const foundInTitle = validationConfig.prohibitedWords.filter((word) =>
      article.title.includes(word)
    );
    const foundInBody = validationConfig.prohibitedWords.filter((word) =>
      article.body.includes(word)
    );

    if (foundInTitle.length) {
      partnerErrors.push(
        `Prohibited words in title: ${foundInTitle.join(", ")}`
      );
    }
    if (foundInBody.length) {
      partnerErrors.push(`Prohibited words in body: ${foundInBody.join(", ")}`);
    }
  }

  // 🚨 If validation failed
  if (partnerErrors.length) {
    await createAuditLog({
      articleId: article.articleId,
      partnerCode,
      statusCode: 400,
      log: { errors: partnerErrors },
      status: "REJECTED",
    });

    await sendToTeams({
      articleId: article.articleId,
      title: article.title,
      errors: partnerErrors,
    });

    return {
      success: false,
      partner: partnerCode,
      errors: partnerErrors,
    };
  }

  // ✅ Call provider handler
  const handler = PROVIDER_HANDLERS[partnerCode.toLowerCase()];
  if (!handler) {
    const errorMsg = `No handler found for provider: ${partnerCode}`;

    await createAuditLog({
      articleId: article.articleId,
      partnerCode,
      statusCode: 500,
      log: { error: errorMsg },
      status: "FAILED",
    });

    return {
      success: false,
      partner: partnerCode,
      errors: [errorMsg],
    };
  }

  try {
    const result = await handler("article", article, config);

    await createAuditLog({
      articleId: article.articleId,
      partnerCode,
      statusCode: 200,
      log: { message: "Content published successfully", response: result },
      status: "PUBLISHED",
    });

    return {
      success: true,
      partner: partnerCode,
      data: result,
    };
  } catch (err) {
    await createAuditLog({
      articleId: article.articleId,
      partnerCode,
      statusCode: 500,
      log: { error: err.message },
      status: "REJECTED",
    });

    return {
      success: false,
      partner: partnerCode,
      errors: [err.message],
    };
  }
};
