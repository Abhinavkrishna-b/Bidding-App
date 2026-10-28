import mongoose from "mongoose";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import Student from "../models/Student.js";
import HttpError from "../errors/HttpError.js";

function isSameObjectId(left, right) {
  return String(left) === String(right);
}

export function getMinimumBid(auction) {
  return auction.currentBid == null
    ? auction.startingPrice
    : auction.currentBid + auction.minimumBidIncrement;
}

function assertRequestMatches(
  existingBid,
  auctionId,
  amount,
  maximumAmount
) {
  if (
    !isSameObjectId(existingBid.auction, auctionId) ||
    existingBid.amount !== amount ||
    (existingBid.maximumAmount ?? null) !== (maximumAmount ?? null)
  ) {
    throw new HttpError(
      409,
      "This request ID was already used for a different bid."
    );
  }
}

export default async function placeBid({
  auctionId,
  bidderId,
  amount,
  maximumAmount,
  requestId,
}) {
  if (
    !mongoose.isValidObjectId(auctionId) ||
    !mongoose.isValidObjectId(bidderId)
  ) {
    throw new HttpError(400, "A valid auction and bidder are required.");
  }

  if (
    !Number.isSafeInteger(amount) ||
    amount <= 0 ||
    (maximumAmount != null &&
      (!Number.isSafeInteger(maximumAmount) || maximumAmount < amount)) ||
    typeof requestId !== "string" ||
    requestId.trim().length < 16 ||
    requestId.trim().length > 128
  ) {
    throw new HttpError(
      400,
      "Provide a positive whole-number bid and a request ID of 16 to 128 characters."
    );
  }

  const session = await mongoose.startSession();
  let acceptedBid;

  try {
    await session.withTransaction(
      async () => {
        const existingBid = await Bid.findOne({
          bidder: bidderId,
          requestId: requestId.trim(),
        })
          .session(session)
          .exec();

        if (existingBid) {
          assertRequestMatches(
            existingBid,
            auctionId,
            amount,
            maximumAmount ?? null
          );
          acceptedBid = existingBid;
          return;
        }

        const bidder = await Student.findOne({
          _id: bidderId,
          isActive: true,
        })
          .select("_id")
          .session(session)
          .exec();

        if (!bidder) {
          throw new HttpError(
            403,
            "Only active students can bid."
          );
        }

        const now = new Date();
        const auction = await Auction.findById(auctionId)
          .session(session)
          .exec();

        if (!auction) {
          throw new HttpError(404, "Auction not found.");
        }

        if (isSameObjectId(auction.seller, bidderId)) {
          throw new HttpError(403, "You cannot bid on your own listing.");
        }

        if (
          auction.status !== "active" ||
          auction.startsAt > now ||
          auction.endsAt <= now
        ) {
          throw new HttpError(409, "This auction is not accepting bids.");
        }

        const minimumBid = getMinimumBid(auction);

        if (!Number.isSafeInteger(minimumBid)) {
          throw new HttpError(
            409,
            "The auction's current bid has reached the supported amount limit."
          );
        }

        if (amount < minimumBid) {
          throw new HttpError(
            400,
            `The minimum allowed bid is ${minimumBid}.`
          );
        }

        if (auction.bidCount >= Number.MAX_SAFE_INTEGER) {
          throw new HttpError(409, "This auction cannot accept more bids.");
        }

        const updatedAuction = await Auction.findOneAndUpdate(
          {
            _id: auction._id,
            seller: { $ne: bidderId },
            status: "active",
            startsAt: { $lte: now },
            endsAt: { $gt: now },
            currentBid: auction.currentBid,
            bidCount: auction.bidCount,
            leadingBidder: auction.leadingBidder,
          },
          {
            $set: {
              currentBid: amount,
              leadingBidder: bidderId,
            },
            $inc: { bidCount: 1 },
          },
          {
            new: true,
            runValidators: true,
            session,
          }
        ).exec();

        if (!updatedAuction) {
          throw new HttpError(
            409,
            "Another bid changed this auction. Refresh and submit a new bid."
          );
        }

        [acceptedBid] = await Bid.create(
          [
            {
              auction: auction._id,
              bidder: bidderId,
              amount,
              maximumAmount: maximumAmount ?? undefined,
              requestId: requestId.trim(),
              placedAt: now,
            },
          ],
          { session }
        );
      },
      {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
        readPreference: "primary",
      }
    );

    return acceptedBid;
  } catch (error) {
    if (error?.code === 11000) {
      const existingBid = await Bid.findOne({
        bidder: bidderId,
        requestId: requestId.trim(),
      }).exec();

      if (existingBid) {
        assertRequestMatches(
          existingBid,
          auctionId,
          amount,
          maximumAmount ?? null
        );
        return existingBid;
      }
    }

    if (
      error?.code === 20 ||
      error?.codeName === "IllegalOperation" ||
      error?.message?.includes("Transaction numbers are only allowed")
    ) {
      throw new HttpError(
        503,
        "Bidding requires MongoDB transactions. Configure MongoDB as a replica set or use MongoDB Atlas."
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
}
