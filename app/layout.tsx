import { Roboto } from '@next/font/google';
import { cookies } from 'next/headers';
import NavBar from '../components/NavBar';
import Providers from '../providers/providers';
import './globals.css';

const robato = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nextCookies = cookies();
  const theme = nextCookies.get('chakra-ui-color-mode')?.value;
  return (
    <html lang="en">
      <body className={robato.className}>
        <Providers cookie={theme}>
          {/* @ts-expect-error Server Component */}

          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
