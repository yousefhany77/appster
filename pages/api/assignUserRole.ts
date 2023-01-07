// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../firebase_admin";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    // Process a POST request
    const { uid, role } = req.body;
    console.log(uid, role);
    adminAuth
      .setCustomUserClaims(uid, { role })
      .then(() => {
        console.log("custom claims set");
      })
      .catch((error) => {
        console.log(error);
      });
    res.status(200).send("");
  } else {
    // Handle any other HTTP method
    res.status(405).send("Method not allowed");
  }
}
