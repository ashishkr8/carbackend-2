import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
    console.log(MONGO_URI)
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
