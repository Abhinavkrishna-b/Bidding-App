import cors from "cors";
import express from "express";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
