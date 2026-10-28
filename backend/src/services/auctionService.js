import fs from "node:fs/promises";
import mongoose from "mongoose";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import HttpError from "../errors/HttpError.js";
import placeBid from "./placeBid.js";
import {
  closeExpiredAuction,
  closeExpiredAuctions,
} from "./auctionLifecycle.js";
import {
  getStoredImagePath,
  removeUploadedFiles,
} from "../utils/imageStorage.js";

const categories = [
  "Electronics",
  "Books",
  "Accessories",
  "Hostel Essentials",
  "Cycles",
  "Others",
];
const conditions = ["New", "Like New", "Good", "Fair"];
const allowedDurations = [6, 12, 24, 72, 168];

function getAuctionId(value) {
  if (!mongoose.isValidObjectId(value)) {
    throw new HttpError(400, "A valid auction ID is required.");
  }
  return value;
}

async function removeOldImage(storageKey) {
  const imagePath = getStoredImagePath(storageKey);
  if (!imagePath) return;

  await fs.unlink(imagePath).catch((error) => {
    if (error.code !== "ENOENT") {
      console.error("Could not remove replaced listing image:", error.message);
    }
  });
}

export function getListingUpdate(body, currentImages, replacementImage) {
  const updates = {};
  const stringFields = [
    ["title", 5, 100],
    ["description", 20, 1500],
    ["location", 1, 120],
  ];

  for (const [field, minimum, maximum] of stringFields) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== "string") {
      throw new HttpError(400, `Enter a valid ${field}.`);
    }

    const value = body[field].trim();
    if (value.length < minimum || value.length > maximum) {
      throw new HttpError(
        400,
        `${field} must contain ${minimum}–${maximum} characters.`
      );
    }

    updates[field === "location" ? "pickupLocation" : field] = value;
  }

  if (body.category !== undefined) {
    if (!categories.includes(body.category)) {
      throw new HttpError(400, "Choose a valid category.");
    }
    updates.category = body.category;
  }

  if (body.condition !== undefined) {
    if (!conditions.includes(body.condition)) {
      throw new HttpError(400, "Choose a valid item condition.");
    }
    updates.condition = body.condition;
  }

  for (const field of ["startingPrice", "minimumBidIncrement"]) {
    if (body[field] === undefined) continue;
    const value = Number(body[field]);
    if (!Number.isSafeInteger(value) || value < 1) {
      throw new HttpError(400, `${field} must be a positive whole number.`);
    }
    updates[field] = value;
  }

  if (replacementImage) {
    const primaryImage =
      currentImages.find((image) => image.isPrimary) || currentImages[0];
    const otherImages = currentImages.filter(
      (image) => image !== primaryImage
    );
    updates.images = [
      {
        url: `/uploads/${replacementImage.filename}`,
        storageKey: replacementImage.filename,
        altText: updates.title || primaryImage?.altText || "",
        isPrimary: true,
      },
      ...otherImages.map((image) => ({
        ...image.toObject(),
        isPrimary: false,
      })),
    ];
  } else if (updates.title && currentImages.length > 0) {
    updates.images = currentImages.map((image) => ({
      ...image.toObject(),
      altText: image.isPrimary ? updates.title : image.altText,
    }));
  }

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "Provide at least one listing change.");
  }

  return updates;
}

export async function listActiveAuctions() {
  const now = new Date();
  return Auction.find({
    status: "active",
    startsAt: { $lte: now },
    endsAt: { $gt: now },
  })
    .populate("seller", "name email")
    .sort({ endsAt: 1 })
    .lean();
}

export async function listSellerAuctions(sellerId) {
  await closeExpiredAuctions();
  return Auction.find({ seller: sellerId })
    .populate("winner", "name")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getAuction(id) {
  await closeExpiredAuction(getAuctionId(id));
  const auction = await Auction.findById(getAuctionId(id))
    .populate("seller", "name email")
    .populate("winner", "name")
    .lean();
  if (!auction) throw new HttpError(404, "Auction not found.");
  return auction;
}

export function listAuctionBids(id) {
  return Bid.find({ auction: getAuctionId(id) })
    .populate("bidder", "name")
    .sort({ placedAt: -1 })
    .lean();
}

export async function createAuction({ sellerId, body, files }) {
  let created = false;
  try {
    const startingPrice = Number(body.startingPrice);
    const minimumBidIncrement = Number(body.minimumBidIncrement || 10);
    const durationHours = Number(body.duration);

    if (files.length === 0) {
      throw new HttpError(400, "Upload at least one item photo.");
    }

    if (
      !Number.isSafeInteger(startingPrice) ||
      startingPrice < 1 ||
      !Number.isSafeInteger(minimumBidIncrement) ||
      minimumBidIncrement < 1 ||
      !allowedDurations.includes(durationHours)
    ) {
      throw new HttpError(
        400,
        "Enter a valid starting price, bid increment, and auction duration."
      );
    }

    const now = new Date();
    const auction = await Auction.create({
      seller: sellerId,
      title: body.title,
      description: body.description,
      category: body.category,
      condition: body.condition,
      pickupLocation: body.location,
      startingPrice,
      minimumBidIncrement,
      startsAt: now,
      endsAt: new Date(now.getTime() + durationHours * 60 * 60 * 1000),
      status: "active",
      images: files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        storageKey: file.filename,
        altText: body.title,
        isPrimary: index === 0,
      })),
    });
    created = true;

    return Auction.findById(auction._id)
      .populate("seller", "name email")
      .lean();
  } catch (error) {
    if (!created) await removeUploadedFiles(files);
    throw error;
  }
}

export async function updateSellerAuction({
  sellerId,
  id,
  body,
  replacementImage,
}) {
  const files = replacementImage ? [replacementImage] : [];
  let saved = false;

  try {
    const auctionId = getAuctionId(id);
    const auction = await Auction.findOne({
      _id: auctionId,
      seller: sellerId,
    });

    if (!auction) throw new HttpError(404, "Listing not found.");

    const now = new Date();
    if (
      auction.status !== "active" ||
      auction.startsAt > now ||
      auction.endsAt <= now ||
      auction.bidCount !== 0
    ) {
      throw new HttpError(
        409,
        "Only active listings with no bids can be edited."
      );
    }

    const updates = getListingUpdate(body, auction.images, replacementImage);
    const previousPrimaryImage = auction.images.find(
      (image) => image.isPrimary
    );
    const updatedAuction = await Auction.findOneAndUpdate(
      {
        _id: auctionId,
        seller: sellerId,
        status: "active",
        startsAt: { $lte: now },
        endsAt: { $gt: now },
        bidCount: 0,
        currentBid: null,
        leadingBidder: null,
      },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("seller", "name email")
      .populate("winner", "name")
      .lean();

    if (!updatedAuction) {
      throw new HttpError(
        409,
        "This listing changed while you were editing it. Refresh and try again."
      );
    }
    saved = true;

    if (replacementImage) {
      await removeOldImage(previousPrimaryImage?.storageKey);
    }

    return updatedAuction;
  } catch (error) {
    if (!saved) await removeUploadedFiles(files);
    throw error;
  }
}

export async function cancelSellerAuction({ sellerId, id }) {
  const auctionId = getAuctionId(id);
  const now = new Date();
  let auction = await Auction.findOneAndUpdate(
    {
      _id: auctionId,
      seller: sellerId,
      status: "active",
      startsAt: { $lte: now },
      endsAt: { $gt: now },
      bidCount: 0,
      currentBid: null,
      leadingBidder: null,
    },
    { $set: { status: "cancelled", closedAt: now } },
    { new: true, runValidators: true }
  )
    .populate("seller", "name email")
    .populate("winner", "name")
    .lean();

  if (!auction) {
    auction = await Auction.findOneAndUpdate(
      {
        _id: auctionId,
        seller: sellerId,
        status: "reserved",
      },
      { $set: { status: "cancelled" } },
      { new: true, runValidators: true }
    )
      .populate("seller", "name email")
      .lean();
  }

  if (auction) return auction;

  const ownedAuction = await Auction.exists({
    _id: auctionId,
    seller: sellerId,
  });
  if (!ownedAuction) throw new HttpError(404, "Listing not found.");

  throw new HttpError(
    409,
    "Only active listings without bids or reserved sales can be cancelled."
  );
}

export async function recordSellerDecision({ sellerId, id, decision }) {
  if (!["approve", "reject"].includes(decision)) {
    throw new HttpError(400, "Choose approve or reject for the seller decision.");
  }

  const auction = await Auction.findOneAndUpdate(
    {
      _id: getAuctionId(id),
      seller: sellerId,
      status: "awaiting_seller_decision",
      winner: { $ne: null },
    },
    {
      $set: {
        status: decision === "approve" ? "reserved" : "rejected",
        sellerDecisionAt: new Date(),
      },
    },
    { new: true, runValidators: true }
  )
    .populate("winner", "name")
    .lean();

  if (auction) return auction;
  const ownedAuction = await Auction.exists({ _id: id, seller: sellerId });
  if (!ownedAuction) throw new HttpError(404, "Listing not found.");
  throw new HttpError(
    409,
    "Only the seller can decide the outcome of an auction awaiting their decision."
  );
}

export async function recordPickupOutcome({ sellerId, id, outcome }) {
  if (!["completed", "failed"].includes(outcome)) {
    throw new HttpError(400, "Choose completed or failed for the pickup outcome.");
  }

  const now = new Date();
  const updates = {
    status: outcome === "completed" ? "sold" : "failed_pickup",
  };
  if (outcome === "completed") updates.completedAt = now;

  const auction = await Auction.findOneAndUpdate(
    {
      _id: getAuctionId(id),
      seller: sellerId,
      status: "reserved",
      winner: { $ne: null },
    },
    { $set: updates },
    { new: true, runValidators: true }
  )
    .populate("winner", "name")
    .lean();

  if (auction) return auction;
  const ownedAuction = await Auction.exists({ _id: id, seller: sellerId });
  if (!ownedAuction) throw new HttpError(404, "Listing not found.");
  throw new HttpError(
    409,
    "Pickup outcomes can only be recorded for a reserved sale."
  );
}

export async function submitAuctionBid({
  auctionId,
  bidderId,
  amount,
  requestId,
}) {
  const id = getAuctionId(auctionId);
  await closeExpiredAuction(id);
  const bid = await placeBid({ auctionId: id, bidderId, amount, requestId });
  const [populatedBid, auction] = await Promise.all([
    Bid.findById(bid._id).populate("bidder", "name").lean(),
    Auction.findById(id).lean(),
  ]);

  return {
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
}
