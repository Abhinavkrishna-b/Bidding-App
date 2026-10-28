import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import connectDatabase from "./config/database.js";

const port = Number(process.env.PORT || 4000);
let server;
let isShuttingDown = false;

async function startServer() {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port between 1 and 65535.");
  }

  await connectDatabase();

  server = app.listen(port, () => {
    console.info(`Campus Auction API listening on port ${port}.`);
  });

  server.on("error", (error) => {
    console.error("HTTP server failed:", error.message);
    process.exitCode = 1;
  });
}

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.info(`${signal} received; shutting down gracefully.`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Graceful shutdown failed:", error.message);
    process.exitCode = 1;
  }
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

startServer().catch((error) => {
  console.error("API startup failed:", error.message);
  process.exitCode = 1;
});
