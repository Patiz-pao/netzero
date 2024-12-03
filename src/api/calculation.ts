import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { province, tumbol, area } = req.body;
    res.status(200).json({ success: true, message: 'Calculation processed', data: { province, tumbol, area } });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}