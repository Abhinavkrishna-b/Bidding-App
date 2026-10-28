import mongoose from "mongoose";
import Auction from "../models/Auction.js";
import HttpError from "../errors/HttpError.js";

export function getExpiredAuctionOutcome(auction, now) {
  if (auction.status !== "active" || auction.endsAt > now) return null;

  if (auction.bidCount === 0) {
    return {
      status: "unsold",
      closedAt: now,
    };
  }

  if (
    !Number.isSafeInteger(auction.currentBid) ||
    !auction.leadingBidder ||
    auction.bidCount < 1
  ) {
    throw new Error(`Auction ${auction._id} has inconsistent bid state.`);
  }

  return {
    status: "awaiting_seller_decision",
    winner: auction.leadingBidder,
    closedAt: now,
  };
}

export async function closeExpiredAuction(auctionId, now = new Date()) {
  if (!mongoose.isValidObjectId(auctionId)) {
    throw new HttpError(400, "A valid auction ID is required.");
  }

  const currentAuction = await Auction.findById(auctionId)
    .select("status endsAt")
    .lean();
  if (!currentAuction) throw new HttpError(404, "Auction not found.");
  if (currentAuction.status !== "active" || currentAuction.endsAt > now) {
    return null;
  }

  const session = await mongoose.startSession();
  let closedAuction = null;

  try {
    await session.withTransaction(
      async () => {
        closedAuction = null;
        const auction = await Auction.findById(auctionId)
          .session(session)
          .exec();
        if (!auction) throw new HttpError(404, "Auction not found.");

        const outcome = getExpiredAuctionOutcome(auction, now);
        if (!outcome) return;

        auction.set(outcome);
        await auction.save({ session });
        closedAuction = auction;
      },
      {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
        readPreference: "primary",
      }
    );
    return closedAuction;
  } catch (error) {
    if (
      error?.code === 20 ||
      error?.codeName === "IllegalOperation" ||
      error?.message?.includes("Transaction numbers are only allowed")
    ) {
      throw new HttpError(
        503,
        "Auction closing requires MongoDB transactions. Configure MongoDB as a replica set or use MongoDB Atlas."
      );
    }
    throw error;
  } finally {
    await session.endSession();
  }
}

export async function closeExpiredAuctions(
  now = new Date(),
  batchSize = 100,
  { continueOnError = false, onClosed } = {}
) {
  const expiredAuctions = await Auction.find({
    status: "active",
    endsAt: { $lte: now },
  })
    .select("_id")
    .sort({ endsAt: 1 })
    .limit(batchSize)
    .lean();

  let closedCount = 0;
  for (const { _id } of expiredAuctions) {
    try {
      const auction = await closeExpiredAuction(_id, now);
      if (auction) {
        closedCount += 1;
        await onClosed?.(auction);
      }
    } catch (error) {
      if (!continueOnError) throw error;
      console.error(`Could not close expired auction ${_id}:`, error);
    }
  }

  return closedCount;
}

export function startAuctionClosingWorker(io, intervalMs = 5_000) {
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      const closedCount = await closeExpiredAuctions(new Date(), 100, {
        continueOnError: true,
        onClosed: async (auction) => {
          if (auction.winner) {
            await auction.populate("winner", "name");
          }
          io.emit("auction:updated", {
            id: auction._id.toString(),
            currentBid: auction.currentBid,
            bidCount: auction.bidCount,
            status: auction.status,
            winner: auction.winner
              ? {
                  id: auction.winner._id?.toString() || auction.winner.toString(),
                  name: auction.winner.name,
                }
              : null,
          });
        },
      });
      if (closedCount > 0) {
        io.emit("auctions:closed");
      }
    } catch (error) {
      console.error("Auction closing worker failed:", error);
    } finally {
      running = false;
    }
  };

  void run();
  const intervalId = setInterval(() => void run(), intervalMs);
  intervalId.unref?.();

  return () => clearInterval(intervalId);
}
