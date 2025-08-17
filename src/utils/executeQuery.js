import { Pool } from 'pg';
import env from '../config/env.js';

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
});

export async function executeQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}