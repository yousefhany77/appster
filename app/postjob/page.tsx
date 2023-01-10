import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import PostJobForm from "../../components/PostJobForm";
import { adminAuth } from "../../firebase_admin";

async function page() {
  const nextCookies = cookies();
  const session = nextCookies.get("session")!.value;
  const user = await adminAuth.verifySessionCookie(session);

  if (user.role !== "company") {
    redirect("/company");
  }

  return <PostJobForm />;
}

export default page;
