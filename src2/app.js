import express from "express";
import cors from "cors";
// import router from "./routes/index.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

app.use((req, res, next) => {
  const originalJson = res.json;

  res.sendResponse = (body) => {
    res.locals.body = body;
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

app.use((err, _req, res, _next) => {
  logger.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;
