"use client";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  useColorModeValue,
  useOutsideClick,
  VStack,
} from "@chakra-ui/react";
import { deleteCookie, setCookie, setCookies } from "cookies-next";
import Link from "next/link";
import React from "react";
import logout from "../util/logout";

function Menu({ isLogedIn }: { isLogedIn: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);
  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  });
  const bg = useColorModeValue("white", "gray.800");
  const bgButton = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  return (
    <div>
      {isLogedIn ? (
        <VStack as={"div"} position={"relative"} ref={ref}>
          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon />}
            variant="outline"
            rounded={"lg"}
            onClick={() => setIsOpen(!isOpen)}
            bgColor={bg}
          />
          {isOpen && (
            <VStack
              position={"absolute"}
              rounded={"lg"}
              top={10}
              right={0}
              bg={bg}
              border={"1px"}
              borderColor={borderColor}
              minWidth={"fit-content"}
              w={"48"}
              zIndex={50}
              overflow={"hidden"}
              shadow={"xs"}
              p={2}
            >
              <Link
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200/40 transition-colors rounded-md  ease-in-out duration-200 text-center w-full"
                href={"/dashboard"}
              >
                Dashboard
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200/40 transition-colors rounded-md  ease-in-out duration-200 text-center w-full"
                href={"/jobs"}
              >
                Find Job
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200/40 transition-colors rounded-md  ease-in-out duration-200 text-center w-full"
                href={"/postjob"}
              >
                Post Job
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200/40 transition-colors rounded-md  ease-in-out duration-200 text-center w-full"
                href={"/profile"}
              >
                Profile
              </Link>
              <Button
                w={"full"}
                colorScheme={"teal"}
                variant={"outline"}
                transitionDuration="0.3s"
                
                onClick={logout}
              >
                Logout
              </Button>
            </VStack>
          )}
        </VStack>
      ) : (
        <HStack as={"div"}>
          <Button
            as={"a"}
            variant="outline"
            _hover={{
              bg: "brand.primaryDark",
              textColor: "white",
            }}
            transitionDuration="0.3s"
            href="/signup"
          >
            Signup
          </Button>
          <Button
            bg={"brand.primary"}
            as={"a"}
            variant="outline"
            textColor="white"
            _hover={{
              bg: "brand.primaryDark",
            }}
            transitionDuration="0.3s"
            href="/login"
          >
            Login
          </Button>
        </HStack>
      )}
    </div>
  );
}

export default Menu;
