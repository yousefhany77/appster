"use client";
import { Button } from "@chakra-ui/react";
import React from "react";
import GenerateFakeJobPostingDate from "../util/GenerateFakeDate";

function Page() {
  return <Button onClick={GenerateFakeJobPostingDate}>Post Job</Button>;
}

export default Page;
