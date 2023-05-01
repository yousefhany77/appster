import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  deleteCookie('session', {
    req,
    res,
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    path: '/',
  });
  console.log('Logged out');
  res.status(200).json({ message: 'Logged out' });
}
