import mongoose from "mongoose";
import { config } from "dotenv";
import { DATABASE_URI } from "../utils/constants";
config();

const connectDb = async () => {
  return await mongoose.connect(DATABASE_URI as string);
};

export default connectDb;
