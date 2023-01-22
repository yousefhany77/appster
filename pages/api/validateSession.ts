import { deleteCookie, hasCookie, setCookies } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../firebase_admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { session } = req.body;
    try {
      const { role } = await adminAuth.verifySessionCookie(session);

      if (role) {
        return res.status(200).json({ role });
      } else {
        res.status(401).json({ role: "" });
      }
    } catch (error) {
      console.log(error);
      res.setHeader(
        "Set-Cookie",
        "session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict"
      );
      return res.status(401).json({ role: "" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).send("Method not allowed");
  }
}
