// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  const msg = {
    to: req.body.to, // Change to your recipient
    from: "demo.youssefhany@gmail.com", // Change to your verified sender
    subject: req.body.subject, // Change to your subject,
    html: req.body.HTMLmessage, // Change to your message,
  };
  try {
    await sgMail.send(msg);
    console.log("Email sent", req.body.to);
    res.send("Email sent");
  } catch (error: any) {
    console.error(error);
    if (error.response) {
      res.send(error.response.body);
    }
  }
}
