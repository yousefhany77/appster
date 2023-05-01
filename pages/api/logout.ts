import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
  deleteCookie('session', {
    req,
    res,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  console.log('Logged out');
  res.writeHead(302, { Location: '/' });
  res.end();
}
