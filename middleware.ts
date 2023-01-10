// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //   check if user has session cookie
  const session = request.cookies.get("session")?.value;
  const isValid =
    session &&
    session.length > 0 &&
    (await isValidSession(session, request.nextUrl.origin));

  if (isValid) {
    const path = request.nextUrl.pathname;
    if (path === "/login" || path === "/signup") {
      return NextResponse.redirect(
        new URL("/", request.nextUrl.origin).toString()
      );
    }
    return NextResponse.next();
  } else {
    const path = request.nextUrl.pathname;
    if (path === "/login" || path === "/signup") {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL(
        `login?callbackurl=${request.nextUrl.origin}${request.nextUrl.pathname}`,
        request.nextUrl.origin
      ).toString()
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/signup", "/dashboard" , "/postjob"],
};

const isValidSession = async (session: string, url: string) => {
  const res = await fetch(`${url}/api/validateSession`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session }),
  });
  return res.ok;
};
