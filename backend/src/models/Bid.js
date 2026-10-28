import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
      immutable: true,
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: "Bid amount must be a whole number.",
      },
      immutable: true,
    },
    maximumAmount: {
      type: Number,
      min: 1,
      validate: {
        validator(value) {
          return value == null || Number.isSafeInteger(value);
        },
        message: "Maximum bid amount must be a whole number.",
      },
      immutable: true,
    },
    requestId: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
      minlength: 16,
      maxlength: 128,
    },
    placedAt: {
      type: Date,
      default: Date.now,
      required: true,
      immutable: true,
    },
  },
  { timestamps: true }
);

bidSchema.pre("validate", function validateMaximumAmount() {
  if (
    this.maximumAmount != null &&
    this.maximumAmount < this.amount
  ) {
    this.invalidate(
      "maximumAmount",
      "Maximum bid amount cannot be lower than the submitted bid."
    );
  }
});

bidSchema.index({ auction: 1, amount: -1, placedAt: 1 });
bidSchema.index({ auction: 1, placedAt: -1 });
bidSchema.index({ bidder: 1, placedAt: -1 });
bidSchema.index(
  { bidder: 1, requestId: 1 },
  { unique: true, name: "unique_bid_request_per_bidder" }
);

const Bid = mongoose.models.Bid || mongoose.model("Bid", bidSchema);

export default Bid;
