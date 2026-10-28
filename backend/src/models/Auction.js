import mongoose from "mongoose";

const auctionImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    storageKey: {
      type: String,
      trim: true,
      default: "",
    },
    altText: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const auctionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1500,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Books",
        "Accessories",
        "Hostel Essentials",
        "Cycles",
        "Others",
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair"],
    },
    images: {
      type: [auctionImageSchema],
      required: true,
      validate: {
        validator: (images) => images.length >= 1 && images.length <= 5,
        message: "An auction must have between 1 and 5 images.",
      },
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: "Starting price must be a whole number.",
      },
    },
    minimumBidIncrement: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: "Minimum bid increment must be a whole number.",
      },
    },
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "upcoming",
        "active",
        "ended",
        "awaiting_seller_decision",
        "reserved",
        "sold",
        "unsold",
        "rejected",
        "cancelled",
        "failed_pickup",
      ],
      default: "draft",
    },
    currentBid: {
      type: Number,
      min: 0,
      default: null,
      validate: {
        validator: (value) => value == null || Number.isSafeInteger(value),
        message: "Current bid must be a whole number.",
      },
    },
    bidCount: {
      type: Number,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Bid count must be a whole number.",
      },
    },
    leadingBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    sellerDecisionAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

auctionSchema.pre("validate", function validateAuctionDates() {
  const closedStatuses = [
    "ended",
    "awaiting_seller_decision",
    "reserved",
    "sold",
    "unsold",
    "rejected",
    "cancelled",
    "failed_pickup",
  ];

  if (
    this.startsAt &&
    this.endsAt &&
    this.endsAt.getTime() <= this.startsAt.getTime()
  ) {
    this.invalidate("endsAt", "Auction end time must be after its start time.");
  }

  if (
    Number.isSafeInteger(this.startingPrice) &&
    this.currentBid != null &&
    this.currentBid < this.startingPrice
  ) {
    this.invalidate(
      "currentBid",
      "Current bid cannot be lower than the starting price."
    );
  }

  if (this.bidCount === 0 && this.currentBid != null) {
    this.invalidate(
      "currentBid",
      "An auction without bids cannot have a current bid."
    );
  }

  if (this.bidCount > 0 && this.currentBid == null) {
    this.invalidate(
      "currentBid",
      "An auction with bids must have a current bid."
    );
  }

  if ((this.bidCount === 0) !== (this.leadingBidder == null)) {
    this.invalidate(
      "leadingBidder",
      "The leading bidder must be set exactly when bids exist."
    );
  }

  if (
    this.images?.length &&
    this.images.filter((image) => image.isPrimary).length !== 1
  ) {
    this.invalidate("images", "Exactly one auction image must be primary.");
  }

  if (
    [
      "ended",
      "awaiting_seller_decision",
      "reserved",
      "sold",
      "rejected",
      "failed_pickup",
    ].includes(this.status) &&
    !this.winner
  ) {
    this.invalidate(
      "winner",
      "A bidder must be selected before recording this auction outcome."
    );
  }

  if (this.status === "unsold" && this.bidCount !== 0) {
    this.invalidate(
      "status",
      "An auction with bids cannot be marked unsold."
    );
  }

  if (this.status === "sold" && !this.completedAt) {
    this.invalidate(
      "completedAt",
      "A sold auction must have a recorded completion time."
    );
  }

  if (closedStatuses.includes(this.status) && !this.closedAt) {
    this.invalidate(
      "closedAt",
      "A closed auction must have a recorded close time."
    );
  }

  if (
    ["reserved", "sold", "rejected", "failed_pickup"].includes(this.status) &&
    !this.sellerDecisionAt
  ) {
    this.invalidate(
      "sellerDecisionAt",
      "Record the seller's decision before updating this outcome."
    );
  }

  if (this.winner && this.status === "cancelled" && !this.sellerDecisionAt) {
    this.invalidate(
      "sellerDecisionAt",
      "A cancelled reserved sale must have a recorded seller decision."
    );
  }

  if (
    this.winner &&
    ![
      "ended",
      "awaiting_seller_decision",
      "reserved",
      "sold",
      "rejected",
      "failed_pickup",
      "cancelled",
    ].includes(this.status)
  ) {
    this.invalidate(
      "winner",
      "A winner can only be recorded after an auction ends."
    );
  }

  if (this.winner && this.seller && this.winner.equals(this.seller)) {
    this.invalidate("winner", "The seller cannot be the auction winner.");
  }
});

auctionSchema.index({ status: 1, startsAt: 1, endsAt: 1 });
auctionSchema.index({ status: 1, category: 1, condition: 1, endsAt: 1 });
auctionSchema.index({ title: "text", description: "text" });
auctionSchema.index({ seller: 1, createdAt: -1 });

const Auction =
  mongoose.models.Auction || mongoose.model("Auction", auctionSchema);

export default Auction;