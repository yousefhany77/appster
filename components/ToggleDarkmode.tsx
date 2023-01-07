"use client";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";
import { setCookie } from "cookies-next";
import React from "react";

function ToggleDarkmode() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <button
      className={`${
        colorMode === "dark"
          ? "border border-slate-600/90 bg-slate-700 hover:bg-slate-800"
          : "border bg-slate-200 hover:bg-slate-400 border-slate-400"
      } transition-colors ease duration-200    rounded-lg w-10 h-10`}
      onClick={() => {
        toggleColorMode();
        setCookie(
          "chakra-ui-color-mode",
          colorMode === "light" ? "dark" : "light"
        );
      }}
    >
      {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

export default ToggleDarkmode;
