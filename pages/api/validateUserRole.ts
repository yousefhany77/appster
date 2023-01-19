import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../firebase_admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { token } = req.body;
    try {
      const { role } = await adminAuth.verifyIdToken(token);
      if (role) return res.status(200).json({ role });
      res.status(401).json({ role: "" });
    } catch (error) {
      console.log(error);
    
      res.status(401).json({ role: "" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).send("Method not allowed");
  }
}
