import { Router } from "express";
import * as auctionController from "../controllers/auctionController.js";
import requireAuth from "../middleware/requireAuth.js";
import {
  uploadAuctionImages,
  uploadReplacementImage,
} from "../middleware/auctionUpload.js";

const router = Router();

router.get("/", auctionController.listActive);
router.get("/mine", requireAuth, auctionController.listMine);
router.get("/:auctionId/bids", auctionController.listBids);
router.get("/:auctionId", auctionController.getById);

router.post(
  "/",
  requireAuth,
  uploadAuctionImages,
  auctionController.create
);
router.patch(
  "/:auctionId",
  requireAuth,
  uploadReplacementImage,
  auctionController.update
);
router.post("/:auctionId/cancel", requireAuth, auctionController.cancel);
router.post(
  "/:auctionId/decision",
  requireAuth,
  auctionController.decideOutcome
);
router.post(
  "/:auctionId/pickup",
  requireAuth,
  auctionController.recordPickup
);
router.post("/:auctionId/bids", requireAuth, auctionController.placeBid);

export default router;
