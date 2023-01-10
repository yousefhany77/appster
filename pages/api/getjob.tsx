// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, firstore } from "../../firebase_admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  const docRef = firstore.collection("job_postings").doc(id);
  const doc = await docRef.get();
  const data = doc.data();
  res.send(data);
}
