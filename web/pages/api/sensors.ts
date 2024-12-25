import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from 'pg';

// To remove size limit
export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  
  const db = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  
  await db.connect();

  if (_req.method === "GET") {
    try {
      
      // Build the SQL query based on the provided parameters
      const query = `SELECT * FROM sensors;`;

      const result = await db.query(query);
      console.log('count: %d', result.rowCount);

 
      res.status(200).json(result.rows);
      db.end();
    } catch (error) {
      res.status(500).json({ message: `Error fetching data: ${error.message}` });
      db.end();
    }
  }
}
