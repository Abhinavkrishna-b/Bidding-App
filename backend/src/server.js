import "dotenv/config";
import { createServer } from "node:http";
import mongoose from "mongoose";
import { Server as SocketServer } from "socket.io";
import app from "./app.js";
import connectDatabase from "./config/database.js";
import { startAuctionClosingWorker } from "./services/auctionLifecycle.js";

const port = Number(process.env.PORT || 4000);
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
});
let server;
let stopAuctionClosingWorker;
let isShuttingDown = false;

io.on("connection", (socket) => {
  socket.on("auction:join", (auctionId) => {
    if (mongoose.isValidObjectId(auctionId)) {
      socket.join(auctionId);
    }
  });
});

async function startServer() {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port between 1 and 65535.");
  }

  await connectDatabase();

  app.set("io", io);
  stopAuctionClosingWorker = startAuctionClosingWorker(io);
  server = httpServer.listen(port, () => {
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
    stopAuctionClosingWorker?.();
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }

    io.close();
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
