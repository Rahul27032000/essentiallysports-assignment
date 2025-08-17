import express from "express";
import cors from "cors";
import { logger } from "./utils/logger/logger.js";
import { serverErrorHandler } from "./errorHandlers/serverErrorHandler.js";
// import router from "./routes/index.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Middleware to add startTime
app.use((req, _res, next) => {
  req.startTime = Date.now();
  next();
});

// ✅ Middleware to log request and response
app.use((req, res, next) => {
  res.on("finish", () => {
    if (req.method === "OPTIONS") return;

    const duration = Date.now() - req.startTime;

    const logEntry = {
      userId: req?.user?.mobile,
      requestCode: req.url.split("/").join("_").toUpperCase().slice(1),
      requestType: req?.requestType || "INTERNAL",
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      responseStatusCode: res.statusCode,
      log: {
        requestBody: req.body,
        requestHeaders: req.headers,
        ip: req.ip || req.socket?.remoteAddress,
        responseBody: res.locals.body || null, // captured via sendResponse
        responseHeaders: res.getHeaders(),
        duration,
      },
      timestamp: new Date().toISOString(),
    };

    logger.info(logEntry);
  });

  next();
});

// ✅ Override res.json to capture response body (like Fastify serializer)
app.use((req, res, next) => {
  const originalJson = res.json;

  res.sendResponse = (body) => {
    res.locals.body = body; // store response for logging
    return originalJson.call(res, body);
  };

  res.json = res.sendResponse;
  next();
});


// app.use("/api", router);

app.get("/", async (_req, res, next) => {
  try {
    res.json({ message: "server is working fine" });
  } catch (err) {
    next(err);
  }
});

app.use(serverErrorHandler);

export default app;
