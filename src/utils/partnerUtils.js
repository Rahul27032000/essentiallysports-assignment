import { executeQuery } from "./executeQuery.js";

export const getActivePartners = async () => {
  const query = {
    text: `
      SELECT code, name, config, "validationConfig"
      FROM "Partner"
      WHERE active = true
    `,
    values: [],
  };

  const result = await executeQuery({text:query});
  return result.rows; 
};