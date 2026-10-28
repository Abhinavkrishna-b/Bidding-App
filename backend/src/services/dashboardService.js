import mongoose from "mongoose";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import Student from "../models/Student.js";
import HttpError from "../errors/HttpError.js";
import { closeExpiredAuctions } from "./auctionLifecycle.js";

const wonStatuses = ["reserved", "sold", "failed_pickup"];

function getAuctionKey(auction) {
  return String(auction?._id || auction);
}

export function groupStudentBids(bids, studentId, now = new Date()) {
  const groupedBids = new Map();

  for (const bid of bids) {
    const auction = bid.auction;
    if (!auction?._id) continue;

    const auctionId = getAuctionKey(auction);
    let activity = groupedBids.get(auctionId);

    if (!activity) {
      const active = auction.status === "active" && auction.endsAt > now;
      const winnerId = auction.winner ? getAuctionKey(auction.winner) : null;
      const isWinner = winnerId === String(studentId);
      activity = {
        auction,
        auctionId,
        myHighestBid: bid.amount,
        latestBidAt: bid.placedAt,
        isActive: active,
        status: active
          ? getAuctionKey(auction.leadingBidder) === String(studentId)
            ? "leading"
            : "outbid"
          : isWinner && auction.status === "awaiting_seller_decision"
            ? "awaiting_seller_decision"
            : auction.status === "unsold"
              ? "unsold"
              : auction.status,
      };
      groupedBids.set(auctionId, activity);
    } else {
      activity.myHighestBid = Math.max(activity.myHighestBid, bid.amount);
      if (bid.placedAt > activity.latestBidAt) {
        activity.latestBidAt = bid.placedAt;
      }
    }
  }

  return [...groupedBids.values()].sort(
    (left, right) => right.latestBidAt - left.latestBidAt
  );
}

export async function getStudentDashboard(studentId) {
  await closeExpiredAuctions();
  const [bids, student, wonAuctions, listings] = await Promise.all([
    Bid.find({ bidder: studentId })
      .sort({ placedAt: -1 })
      .populate({
        path: "auction",
        select:
          "title category images startingPrice currentBid bidCount endsAt status leadingBidder winner seller pickupLocation condition",
        populate: [{ path: "seller", select: "name" }, { path: "winner", select: "name" }],
      })
      .lean(),
    Student.findById(studentId)
      .select("watchlist")
      .populate({
        path: "watchlist",
        match: { status: { $ne: "cancelled" } },
        populate: { path: "seller", select: "name" },
      })
      .lean(),
    Auction.find({
      winner: studentId,
      status: { $in: wonStatuses },
    })
      .populate("seller", "name")
      .sort({ closedAt: -1 })
      .lean(),
    Auction.find({ seller: studentId })
      .populate("winner", "name")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  if (!student) throw new HttpError(401, "Your account is unavailable.");

  return {
    bids: groupStudentBids(bids, studentId),
    bidCount: bids.length,
    watchlist: (student.watchlist || []).filter(Boolean),
    wins: wonAuctions,
    listings,
  };
}

export async function addStudentWatchlistItem(studentId, auctionId) {
  if (!mongoose.isValidObjectId(auctionId)) {
    throw new HttpError(400, "A valid auction ID is required.");
  }

  const auction = await Auction.findOne({
    _id: auctionId,
    status: { $ne: "cancelled" },
  })
    .select("_id")
    .lean();
  if (!auction) throw new HttpError(404, "Auction not found.");

  const student = await Student.findOneAndUpdate(
    { _id: studentId, isActive: true },
    { $addToSet: { watchlist: auction._id } },
    { new: true }
  );
  if (!student) throw new HttpError(401, "Your account is unavailable.");

  return { auctionId: auction._id.toString(), saved: true };
}

export async function removeStudentWatchlistItem(studentId, auctionId) {
  if (!mongoose.isValidObjectId(auctionId)) {
    throw new HttpError(400, "A valid auction ID is required.");
  }

  const student = await Student.findOneAndUpdate(
    { _id: studentId, isActive: true },
    { $pull: { watchlist: auctionId } },
    { new: true }
  )
    .select("_id")
    .lean();
  if (!student) throw new HttpError(401, "Your account is unavailable.");

  return { auctionId: String(auctionId), saved: false };
}
