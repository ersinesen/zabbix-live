import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const LOGFILE = process.env.LOGFILE; // Adjust the path to your log file
const LASTLINE = 1000;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const logFilePath = path.resolve(LOGFILE);

  if (req.method === "GET") {
    fs.readFile(logFilePath, "utf8", (err, data) => {
      if (err) {
        res.status(500).json({ message: "Error reading log file" });
        return;
      }

      // Split the data into lines
      const lines = data.split('\n');

      // Get the last LASTLINE lines
      const lastLines = lines.slice(-LASTLINE).join('\n');

      // Send the last lines as the response
      res.setHeader("Content-Type", "text/plain");
      res.status(200).send(lastLines);
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
