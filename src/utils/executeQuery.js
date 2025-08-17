import pool from "../config/dbConfig.js";

export const executeQuery = async ({ text, values = [], client = null }) => {
  const useClient = client || (await pool.connect());
  try {
    const result = await useClient.query(text, values);
    return result;
  } finally {
    if (!client && useClient) {
      useClient.release(); 
    }
  }
};
