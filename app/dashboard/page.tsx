import { cookies } from "next/headers";
import EmployeeDashboard from "../../components/dashboard/employee";
import EmployerDashboard from "../../components/dashboard/employer";

async function Page({
  searchParams,
}: {
  searchParams?: { tab: "myApplications" };
}) {
  const nextCookies = cookies();
  const session = nextCookies.get("session")?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/validateSession`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session }),
    }
  );
  const { role } = await res.json();
  return (
    <div className="container mx-auto">
      {role === "company" && searchParams?.tab !== "myApplications" ? (
        <EmployerDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </div>
  );
}

export default Page;
