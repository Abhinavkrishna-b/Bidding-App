import mongoose from "mongoose";

export default async function connectDatabase() {
  const connectionString = process.env.MONGODB_URI;

  if (
    !connectionString ||
    connectionString.includes("<YOUR_MONGODB_CONNECTION_STRING>")
  ) {
    throw new Error(
      "Set MONGODB_URI in backend/.env to your MongoDB connection string."
    );
  }

  await mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.info("Connected to MongoDB.");
}
