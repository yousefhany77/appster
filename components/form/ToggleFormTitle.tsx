import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function ToggleFormTitle() {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <Flex
      rounded={"xl"}
      shadow={"sm"}
      overflow={"hidden"}
      mx="auto"
      mb={10}
      className="w-2/3 cursor-pointer"
    >
      <Box
        bg={`${pathName === "/signup" ? "gray.300" : "gray.400"}`}
        textColor={`${pathName === "/signup" ? "brand.primary" : "white"}`}
        p={4}
        shadow={"xl"}
        w={"full"}
        fontWeight="extrabold"
        fontSize="lg"
      >
        <Link href={"/signup"} className=" text-center block w-full">
          Signup
        </Link>
      </Box>
      <Box
        bg={`${pathName === "/login" ? "gray.300" : "gray.400"}`}
        textColor={`${
          pathName?.includes("/login") ? "brand.primary" : "white"
        }`}
        p={4}
        fontWeight="extrabold"
        fontSize="lg"
        w={"full"}
      >
        <Link href={"/login"} className=" text-center block w-full">
          Login{" "}
        </Link>
      </Box>
    </Flex>
  );
}

export default ToggleFormTitle;
