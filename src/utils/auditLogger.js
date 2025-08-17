import { executeQuery } from "./executeQuery.js";

export const createAuditLog = async ({
  articleId,
  partnerCode,
  statusCode,
  log,
  status = "PENDING",
}) => {
  try {
    await executeQuery({
      text: `
        INSERT INTO "AuditLog" ("articleId", "partnerCode", "statusCode", log, status)
        VALUES ($1, $2, $3, $4, $5)
      `,
      values: [articleId, partnerCode, statusCode, log, status],
    });

    console.log(`📝 Audit log created for partner: ${partnerCode}`);
  } catch (err) {
    console.error("❌ Failed to create audit log:", err);
  }
};
