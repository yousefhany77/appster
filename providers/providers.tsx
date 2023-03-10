"use client";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
function Providers({
  children,
  cookie,
}: {
  children: React.ReactNode;
  cookie: string | undefined;
}) {
  const theme = extendTheme({
    config: {
      initialColorMode: cookie,
    },
    fonts: {
      heading: "Roboto",
      body: "Roboto",
    },
    colors: {
      brand: {
        primary: "#38B2AC",
        primaryDark: "#2C7A7B",
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
