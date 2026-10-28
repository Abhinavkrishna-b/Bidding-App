import mongoose from "mongoose";

function omitSensitiveFields(_document, result) {
  delete result.passwordHash;
  delete result.__v;
  return result;
}

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
      immutable: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    profileImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    watchlist: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auction",
        },
      ],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: omitSensitiveFields,
    },
    toObject: { transform: omitSensitiveFields },
  }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
