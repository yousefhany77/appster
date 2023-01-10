"use client";
import {
  Button,
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  useColorMode,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import { getCookie, hasCookie, setCookie } from "cookies-next";
function Providers({
  children,
  cookie,
}: {
  children: React.ReactNode;
  cookie: string | undefined;
}) {
  const theme = extendTheme({
    Button: {
      baseStyle: {
        border: "none",
      },
    },
   
    config: {
      initialColorMode: cookie,
    },
    fonts: {
      heading: "Roboto",
      body: "Roboto",
    },
    colors: {
      brand: {
        primary: "#fe5252",
        primaryDark: "#E23E57",
        secondry: "#f4f1ea",
        secondryDark: "#E1D7C6",
      },
    },
  });
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      {children}
    </ChakraProvider>
  );
}

export default Providers;
