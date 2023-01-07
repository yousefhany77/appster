import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

const credentials = cert({
  clientEmail: process.env.NEXT_PUBLIC_client_email,
  privateKey: process.env.private_key,
  projectId: process.env.NEXT_PUBLIC_projectId,
});
const app = !getApps().length
  ? initializeApp({
      credential: credentials,
    })
  : getApp();

const adminAuth = getAuth(app);

export { adminAuth };
