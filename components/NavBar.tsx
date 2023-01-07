import localFont from "@next/font/local";
const brandFont = localFont({
  src: "../public/brandFont.woff2",
});

import ToggleDarkmode from "./ToggleDarkmode";
function NavBar() {
  console.log("brandFont");
  return (
    <header
      className={`w-full py-5  flex  items-center justify-between gap-3 px-10 shadow-md `}
    >
      <span
        className={`${brandFont.className} text-3xl font-extrabold text-primary hidden lg:block`}
      >
        Appster
      </span>
      <span
        className={`${brandFont.className} text-3xl font-extrabold text-primary lg:hidden`}
      >
        A
      </span>

      <ToggleDarkmode />
    </header>
  );
}

export default NavBar;
