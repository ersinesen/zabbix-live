import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  NOTIFYHUB_URL: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ NOTIFYHUB_URL: process.env.NOTIFYHUB_URL! });
}
