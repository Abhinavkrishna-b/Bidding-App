import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import requireAuth from "../middleware/requireAuth.js";
import placeBid from "../services/placeBid.js";

const router = Router();
const uploadsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads"
);
const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_request, _file, callback) => {
      fs.mkdir(uploadsDirectory, { recursive: true })
        .then(() => callback(null, uploadsDirectory))
        .catch(callback);
    },
    filename: (_request, file, callback) => {
      callback(null, `${randomUUID()}${allowedImageTypes.get(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_request, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, PNG, and WebP images are allowed.");
      error.statusCode = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

async function removeUploadedFiles(files = []) {
  await Promise.all(
    files.map((file) =>
      fs.unlink(file.path).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      })
    )
  );
}

function getAuctionId(value) {
  if (!mongoose.isValidObjectId(value)) {
    const error = new Error("A valid auction ID is required.");
    error.statusCode = 400;
    throw error;
  }
  return value;
}

router.get("/", async (_request, response) => {
  const now = new Date();
  const auctions = await Auction.find({
    status: "active",
    startsAt: { $lte: now },
    endsAt: { $gt: now },
  })
    .populate("seller", "name email")
    .sort({ endsAt: 1 })
    .lean();

  response.json({ auctions });
});

router.get("/:auctionId", async (request, response) => {
  const auction = await Auction.findById(
    getAuctionId(request.params.auctionId)
  )
    .populate("seller", "name email")
    .lean();

  if (!auction) {
    return response
      .status(404)
      .json({ error: { message: "Auction not found." } });
  }

  response.json({ auction });
});

router.get("/:auctionId/bids", async (request, response) => {
  const auctionId = getAuctionId(request.params.auctionId);
  const bids = await Bid.find({ auction: auctionId })
    .populate("bidder", "name")
    .sort({ placedAt: -1 })
    .lean();

  response.json({ bids });
});

router.post(
  "/",
  requireAuth,
  upload.array("images", 5),
  async (request, response, next) => {
    const files = request.files || [];

    try {
      const startingPrice = Number(request.body.startingPrice);
      const minimumBidIncrement = Number(
        request.body.minimumBidIncrement || 10
      );
      const durationHours = Number(request.body.duration);
      const now = new Date();

      if (files.length === 0) {
        const error = new Error("Upload at least one item photo.");
        error.statusCode = 400;
        throw error;
      }

      if (
        !Number.isSafeInteger(startingPrice) ||
        startingPrice < 1 ||
        !Number.isSafeInteger(minimumBidIncrement) ||
        minimumBidIncrement < 1 ||
        ![6, 12, 24, 72, 168].includes(durationHours)
      ) {
        const error = new Error(
          "Enter a valid starting price, bid increment, and auction duration."
        );
        error.statusCode = 400;
        throw error;
      }

      const auction = await Auction.create({
        seller: request.user._id,
        title: request.body.title,
        description: request.body.description,
        category: request.body.category,
        condition: request.body.condition,
        pickupLocation: request.body.location,
        startingPrice,
        minimumBidIncrement,
        startsAt: now,
        endsAt: new Date(now.getTime() + durationHours * 60 * 60 * 1000),
        status: "active",
        images: files.map((file, index) => ({
          url: `/uploads/${file.filename}`,
          storageKey: file.filename,
          altText: request.body.title,
          isPrimary: index === 0,
        })),
      });

      const populatedAuction = await Auction.findById(auction._id)
        .populate("seller", "name email")
        .lean();
      request.app.get("io")?.emit("auction:updated", {
        id: auction._id.toString(),
        currentBid: null,
        bidCount: 0,
      });
      response.status(201).json({ auction: populatedAuction });
    } catch (error) {
      try {
        await removeUploadedFiles(files);
      } catch (cleanupError) {
        next(cleanupError);
        return;
      }
      next(error);
    }
  }
);

router.post("/:auctionId/bids", requireAuth, async (request, response, next) => {
  try {
    const auctionId = getAuctionId(request.params.auctionId);
    const amount = Number(request.body?.amount);
    const requestId =
      typeof request.body?.requestId === "string"
        ? request.body.requestId
        : randomUUID();

    const bid = await placeBid({
      auctionId,
      bidderId: request.user._id,
      amount,
      requestId,
    });

    const [populatedBid, auction] = await Promise.all([
      Bid.findById(bid._id).populate("bidder", "name").lean(),
      Auction.findById(auctionId).populate("seller", "name").lean(),
    ]);

    const event = {
      auction: {
        id: auction._id.toString(),
        currentBid: auction.currentBid,
        bidCount: auction.bidCount,
        leadingBidder: auction.leadingBidder?.toString() || null,
      },
      bid: {
        id: populatedBid._id.toString(),
        amount: populatedBid.amount,
        bidder: populatedBid.bidder?.name || "Student",
        placedAt: populatedBid.placedAt,
      },
    };

    request.app.get("io")?.to(auctionId).emit("bid:placed", event);
    request.app.get("io")?.emit("auction:updated", event.auction);
    response.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

export default router;
