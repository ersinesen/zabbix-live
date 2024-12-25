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
    const itemid = _req.query.itemid;
    if (!itemid) {
      res.status(400).json({ message: 'Missing required parameter: itemid' });
      return;
    }
  
    const t1 = _req.query.t1; // Unix timestamp or datetime string (like NOW())
    const t2 = _req.query.t2; // Unix timestamp or datetime string (like NOW())
    const limit = parseInt(_req.query.limit as string) || 100; // Default limit to 100 if not provided
    const offset = parseInt(_req.query.offset as string) || 0; // Default offset to 0 if not provided

    // Ensure that t1 and t2 are valid numbers (Unix timestamps)
    const t1Converted = t1 && !isNaN(Number(t1)) ? `TO_TIMESTAMP(${t1})` : 'NOW() - INTERVAL \'1 hour\'';
    const t2Converted = t2 && !isNaN(Number(t2)) ? `TO_TIMESTAMP(${t2})` : 'NOW()';

    // Build the SQL query with dynamic values
    const query = `
      SELECT clock, value, ns
      FROM history
      WHERE itemid = $1
      AND clock BETWEEN EXTRACT(EPOCH FROM (${t1Converted})) AND EXTRACT(EPOCH FROM (${t2Converted}))
      ORDER BY clock
      LIMIT $2 OFFSET $3;
    `;
  
    // Execute the query with the parameters
    const parameters = [itemid, limit, offset];
    
    try {
      const result = await db.query(query, parameters);
      console.log('count: %d', result.rowCount);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching history data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
    db.end();
  }
}
