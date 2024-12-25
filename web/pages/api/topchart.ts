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
    
        const { sensor, field, _topN} = _req.query;

        if ( !sensor || !field) {
            res.status(400).json({ message: 'Sensor and field are required.' });
            db.end();
            return;
        }

        // Set default values for topN
        const topN = _topN ? parseInt(_topN, 10) : 20;

        // Build the SQL query based on the provided parameters
        const query = `
            SELECT device, ${field}
            FROM ${sensor}
            WHERE ts > now() - interval '1 minute'
            ORDER BY ${field} DESC
            LIMIT $1;
        `;

        const result = await db.query(query, [topN]);
        console.log('count: %d', result.rowCount);
        res.status(200).json(result.rows);
        db.end();
    } catch (error) {
        res.status(500).json({ message: `Error fetching data: ${error.message}` });
        db.end();
    }
  }
}
