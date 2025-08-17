import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_NAME: process.env.DB_NAME || 'essentiallysports',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_PORT: process.env.DB_PORT || 5432,
};