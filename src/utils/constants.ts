import { config } from "dotenv";

config();

export const DATABASE_URI = process.env.DATABASE_URI;
export const PORT = process.env.PORT || 7000;
