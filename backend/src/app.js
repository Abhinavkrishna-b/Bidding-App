import cors from "cors";
import express from "express";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import authRoutes from "./routes/authRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { uploadsDirectory } from "./utils/imageStorage.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/uploads", express.static(uploadsDirectory));
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
