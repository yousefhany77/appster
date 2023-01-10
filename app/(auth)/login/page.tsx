"use client";

import {
  Button,
  Center,
  Container,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import InputField from "../../../components/form/InputField";
import ToggleFormTitle from "../../../components/form/ToggleFormTitle";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "../../../firebase";
import createUserSession from "../../../util/CreateUserSession";
import { useSearchParams } from "next/navigation";

function LoginPage() {
  const searchParams = useSearchParams();
  const callbackurl = searchParams.get("callbackurl");
  const toast = useToast();
  const bgForm = useColorModeValue("gray.100", "gray.700");
  const bgButton = useColorModeValue("brand.primary", "gray.800");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values, actions) => {
      try {
        const { user } = await signInWithEmailAndPassword(
          clientAuth,
          values.email,
          values.password
        );
        const token = await user.getIdToken(true);
        await createUserSession(token, clientAuth.signOut);
        toast({
          title: "Success",
          description: "You have successfully logged in",
          status: "success",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
        formik.resetForm();
        window.location.assign(callbackurl || "/");
      } catch (error: any) {
        toast({
          title: "An error occurred.",
          description: error.code || error.message || "Something went wrong",
          status: "error",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
      } finally {
        actions.setSubmitting(false);
      }
    },
  });
  return (
    <Center p={10}>
      <Container
        bg={bgForm}
        p={12}
        className=" w-full space-y-5 shadow-md rounded-xl"
      >
        <ToggleFormTitle />
        <VStack
          as="form"
          mx="auto"
          spacing={4}
          justifyContent="start"
          autoComplete="off"
          onSubmit={(e: any) => formik.handleSubmit(e)}
          onKeyDown={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
        >
          <InputField
            formik={formik}
            name={"email"}
            label={"email"}
            placeholder={"Your Email"}
            type="email"
            isRequired
          />
          <InputField
            formik={formik}
            name={"password"}
            label={"password"}
            type="password"
            placeholder="**********"
            isRequired
          />

          <Button
            isLoading={formik.isSubmitting}
            width={"full"}
            variant="outline"
            bg={bgButton}
            disabled={formik.isSubmitting}
            textColor="white"
            _hover={{
              bg: "brand.primaryDark",
            }}
            transitionDuration="0.3s"
            type="submit"
          >
            Login
          </Button>
        </VStack>
      </Container>
    </Center>
  );
}

export default LoginPage;
