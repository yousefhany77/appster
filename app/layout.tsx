import "./globals.css";
import { Roboto } from '@next/font/google';
import Providers from "../providers/providers";
import { cookies } from 'next/headers';
import NavBar from "../components/NavBar";

const robato = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin-ext"],
});

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const nextCookies = cookies();
  const theme = nextCookies.get("chakra-ui-color-mode")?.value
  return (
    <html lang="en" className={robato.className}>
      <body>
        <Providers cookie={theme}>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

