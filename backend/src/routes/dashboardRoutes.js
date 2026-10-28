import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);
router.get("/", dashboardController.getDashboard);
router.post(
  "/watchlist/:auctionId",
  dashboardController.addWatchlistItem
);
router.delete(
  "/watchlist/:auctionId",
  dashboardController.removeWatchlistItem
);

export default router;
