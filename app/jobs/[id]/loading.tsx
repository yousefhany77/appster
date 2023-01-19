"use client";
import {
  Box,
  Skeleton,
  SkeletonText,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

function LoadingJob() {
  const bgForm = useColorModeValue("gray.50", "gray.700");
  return (
    <Box bg={bgForm} p={6} className=" w-full  rounded-xl">
      <Skeleton height="15px" rounded={"md"} my={3} width={"56"} />
      <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="2" />
      <Skeleton height="15px" rounded={"md"} my={3} width={"24"} />
      <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      <Skeleton height="15px" rounded={"md"} my={3} width={"44"} />
      <SkeletonText mt="4" noOfLines={16} spacing="4" skeletonHeight="2" />
    </Box>
  );
}

export default LoadingJob;
