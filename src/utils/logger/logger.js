import { createLogger, format } from "winston";
import Transport from "winston-transport";
import { executeQuery } from "../executeQuery.js";

class PrismaTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  async log(info, callback) {
    process.nextTick(() => this.emit("logged", info));

    const {
      requestCode = "UNKNOWN",
      requestType = "INTERNAL",
      requestMethod = "UNKNOWN",
      requestUrl = "UNKNOWN",
      responseStatusCode = 500,
      log: logData = {},
    } = info.message || {};

    const timestamp = info.timestamp ? new Date(info.timestamp) : new Date();

    try {
      await executeQuery({
        text: `
          INSERT INTO "RequestLog"
          ("requestCode", "requestType", "requestMethod", "requestUrl", "requestedAt", "responseStatusCode", "responseAt", "log")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        values: [
          requestCode,
          requestType,
          requestMethod,
          requestUrl,
          timestamp,
          responseStatusCode,
          new Date(),
          logData,
        ],
      });
    } catch (error) {
      console.error("Error logging to Prisma:", error);
    }

    callback();
  }
}

export default PrismaTransport;

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new PrismaTransport()],
});
