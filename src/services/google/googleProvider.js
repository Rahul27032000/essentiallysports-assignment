import axios from "axios";
import { logger } from "../../utils/logger/logger.js";
import { GOOGLE_API_URL } from "../../config/config.js";

export class GoogleProvider {
  static async get(endpoint, config) {
    try {
      const response = await axios.get(GOOGLE_API_URL + endpoint, {
        headers: {
          Authorization: `Bearer ${config.token}`,
        },
      });

      const logEntry = {
        userId: null,
        requestCode: endpoint.split("/").join("_").toUpperCase().slice(1),
        requestType: "OUTBOUND",
        requestMethod: response?.config?.method,
        requestUrl: response?.config?.url,
        responseStatusCode: response?.status,
        log: {
          requestBody: {},
          responseHeaders: response?.headers,
          requestHeaders: response?.request?._headers,
          responseData: response?.data,
        },
        timestamp: new Date().toISOString(),
      };
      logger.info(logEntry);

      return response.data;
    } catch (error) {
      const logEntry = {
        userId: null,
        requestCode: endpoint.split("/").join("_").toUpperCase().slice(1),
        requestType: "OUTBOUND",
        requestMethod: error?.config?.method,
        requestUrl: error?.config?.url,
        responseStatusCode: error?.response?.status || 500,
        log: {
          responseHeaders: error?.response?.headers,
          requestHeaders: error?.request?._headers,
          requestBody: {},
          responseData: error?.response?.data,
        },
        timestamp: new Date().toString(),
      };
      logger.info(logEntry);

      throw error;
    }
  }

  static async post(payload, endpoint, config) {
    try {
      const response = await axios.post(GOOGLE_API_URL + endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.token}`,
        },
      });

      const logEntry = {
        userId: null,
        requestCode: endpoint.split("/").join("_").toUpperCase().slice(1),
        requestType: "OUTBOUND",
        requestMethod: response?.config?.method,
        requestUrl: response?.config?.url,
        responseStatusCode: response?.status,
        log: {
          requestBody: payload,
          responseHeaders: response?.headers,
          requestHeaders: response?.request?._headers,
          responseData: response?.data,
        },
        timestamp: new Date().toISOString(),
      };
      logger.info(logEntry);

      return response.data;
    } catch (error) {
      const logEntry = {
        userId: null,
        requestCode: endpoint.split("/").join("_").toUpperCase().slice(1),
        requestType: "OUTBOUND",
        requestMethod: error?.config?.method,
        requestUrl: error?.config?.url,
        responseStatusCode: error?.response?.status || 500,
        log: {
          responseHeaders: error?.response?.headers,
          requestHeaders: error?.request?._headers,
          requestBody: JSON.stringify(payload),
          responseData: error?.response?.data,
        },
        timestamp: new Date().toString(),
      };
      logger.info(logEntry);

      throw error;
    }
  }
}
