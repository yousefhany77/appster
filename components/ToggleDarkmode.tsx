"use client";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { setCookie } from "cookies-next";
import React from "react";

function ToggleDarkmode() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (

    <IconButton
      aria-label="toggle dark mode"
      variant={"outline"}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={() => {
        toggleColorMode();
        setCookie(
          "chakra-ui-color-mode",
          colorMode === "light" ? "dark" : "light"
        );
      }}
    />
  );
}

export default ToggleDarkmode;
