import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const ADDRESS = process.env.ADDRESS;
export const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL