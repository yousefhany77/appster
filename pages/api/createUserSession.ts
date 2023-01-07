import { setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../firebase_admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { token } = req.body;
    if (!token) return res.status(401).send("Unauthorized");
    try {
      const session = await adminAuth.createSessionCookie(token, {
        expiresIn: 1000 * 60 * 60 * 24 * 13,
      });

      setCookie("session", session, {
        req,
        res,
        maxAge: 60 * 60 * 24 * 13,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
        path: "/",
      });
      res.end(JSON.stringify({ status: "success" }));
    } catch (error) {
      console.log(error);
      return res.status(401).send("Unauthorized");
    }
  } else {
    // Handle any other HTTP method
    res.status(405).send("Method not allowed");
  }
}
