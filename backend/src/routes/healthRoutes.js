import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (_request, response) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  response.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    services: {
      api: "ok",
      database: databaseConnected ? "connected" : "disconnected",
    },
  });
});

export default router;
