import app from "./app.js";
import { ADDRESS, PORT } from "./config/config.js";

async function start() {
  try {
    app.listen(PORT, ADDRESS, () =>
      console.log(`🚀  API listening on http://${ADDRESS}:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
