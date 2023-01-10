import { deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  deleteCookie("session", { req, res });
  console.log("Logged out");
  res.status(200).json({ message: "Logged out" });
}
