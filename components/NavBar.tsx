import localFont from "@next/font/local";
import { cookies } from "next/headers";
import Link from "next/link";
import { adminAuth } from "../firebase_admin";
const brandFont = localFont({
  src: "../public/brandFont.woff2",
});
import Menu from "./Menu";
import ToggleDarkmode from "./ToggleDarkmode";
async function NavBar() {
  const nextCookies = cookies();
  const session = nextCookies.get("session")?.value;
  const isValid = !!session && !!(await adminAuth.verifySessionCookie(session));
  return (
    <header
      className={`w-full py-5  flex  items-center justify-between gap-3 px-4 lg:px-10 shadow-md `}
    >
      <Link
        href="/"
        className={`${brandFont.className} text-3xl font-extrabold  flex-1 text-primary hidden lg:block`}
      >
        Appster
      </Link>
      <Link
        href="/"
        className={`${brandFont.className} text-3xl font-extrabold text-primary flex-1 lg:hidden`}
      >
        A
      </Link>

      <ToggleDarkmode />
      <Menu isLogedIn={isValid} />
    </header>
  );
}

export default NavBar;
