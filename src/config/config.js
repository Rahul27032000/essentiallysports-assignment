import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const ENVIRONMENT = process.env.ENVIRONMENT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const ADDRESS = process.env.ADDRESS;
export const GOOGLE_API_URL = process.env.GOOGLE_API_URL;
export const MSN_API_URL = process.env.MSN_API_URL;
export const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL