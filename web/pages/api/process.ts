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

        const { device, start_time, end_time, limit } = _req.query;

        if (!device || !start_time || !end_time) {
          res.status(400).json({ message: 'Device, start_time and end_time are required.' });
          db.end();
          return;
        }
  
        // Set default values for topN
        const limit_ = limit ? parseInt(limit, 10) : 1000;

        // Build the SQL query based on the provided parameters
        const query = `
            SELECT *
            FROM process
            WHERE insert_time BETWEEN $1 AND $2 and device ILIKE $3
            ORDER BY insert_time DESC
            LIMIT $4;
        `;

        const result = await db.query(query, [start_time, end_time, device, limit_]);
        console.log('count: %d', result.rowCount);
        res.status(200).json(result.rows);
        db.end();
    } catch (error) {
        res.status(500).json({ message: `Error fetching process data: ${error.message}` });
        db.end();
    }
  }
}
