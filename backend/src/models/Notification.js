import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "new_bid",
        "outbid",
        "ending_soon",
        "auction_ended",
        "auction_result",
        "pickup_update",
        "transaction_update",
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
    eventKey: {
      type: String,
      trim: true,
      maxlength: 160,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, readAt: 1 });
notificationSchema.index(
  { recipient: 1, eventKey: 1 },
  {
    unique: true,
    partialFilterExpression: { eventKey: { $type: "string" } },
    name: "unique_notification_event_per_recipient",
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
