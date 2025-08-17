import pg from 'pg';
import { DATABASE_URL } from './config.js';

// console.log("database url",DATABASE_URL)
const createPool = (maxConnections) => {
  return new pg.Pool({
    connectionString:DATABASE_URL,
    max: maxConnections,
    min: 0,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
};


export const pool = createPool(100);

export default pool;