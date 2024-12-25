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
      const { devices, sensor, field, start_time, end_time } = _req.query;

      if (!devices || !sensor || !field) {
        res.status(400).json({ message: 'Devices, sensor and field are required.' });
        db.end();
        return;
      }

      // Set default values for start_time and end_time
      const endTime = end_time ? new Date(end_time as string) : new Date();
      const startTime = start_time ? new Date(start_time as string) : new Date(endTime.getTime() - 15 * 60 * 1000); // 1 hour before end_time
      console.log(startTime, endTime);

      // Convert devices array to a SQL-safe format
      const devicesArray = Array.isArray(devices) ? devices : [devices];

      // Initialize result array
      const results: any[] = [];

      // Perform query for each device
      for (const device of devicesArray) {
        // Dynamically construct the table name
        const tableName = `${device}_${sensor}`;

        // Build the SQL query
        const query = `
          SELECT ts, ${field} FROM ${tableName}
          WHERE ts BETWEEN $1 AND $2;
        `;

        const values = [startTime.toISOString(), endTime.toISOString()];

        try {
            const response = await db.query(query, values);
            const seriesData = response.rows.map(entry => entry[`${field}`]);
            const seriesDate = response.rows.map(entry => entry.ts);

            // Append formatted result to the results array
            results.push({
                name: device,
                date: seriesDate,
                data: seriesData
            });
        } catch (error) {
            console.error(`Error querying ${tableName}: ${error.message}`);

            // Append error result to the results array
            results.push({
            name: device,
            data: [],
            error: `Error querying ${tableName}: ${error.message}`
            });
        }
      }

      res.status(200).json(results);
      db.end();
    } catch (error) {
      res.status(500).json({ message: `Error fetching data: ${error.message}` });
      db.end();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
    db.end();
  }

}
