import { collection, getDocs, query, where } from "firebase/firestore/lite";
import React from "react";
import { db } from "../../firebase";
import { cookies } from "next/headers";
import { adminAuth } from "../../firebase_admin";
import { redirect } from "next/navigation";
import RegisterCompany from "../../components/form/compay/Register";

async function Page() {
  const nextCookies = cookies();
  const session = nextCookies.get("session")?.value;
  if (!session) redirect("/login");

  const user = await adminAuth.verifySessionCookie(session);

  if (user) {
    const q = query(collection(db, "company"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const company = querySnapshot.docs.length === 1;
    return company ? redirect("/postjob") : <RegisterCompany />;
  }
}

export default Page;
