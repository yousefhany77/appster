"use client";
import {
  Button,
  Center,
  Container,
  Heading,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import PersonalInfo from "../../../components/form/employee/PersonalInfo";
import * as Yup from "yup";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { clientAuth, db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore/lite";
import ToggleFormTitle from "../../../components/form/ToggleFormTitle";
import createUserSession from "../../../util/CreateUserSession";
import logout from "../../../util/logout";
import { useRouter } from "next/navigation";
function SignupPage() {
  const toast = useToast();
  const bgForm = useColorModeValue("gray.50", "gray.700");
  const bgButton = useColorModeValue("brand.primary", "gray.800");
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      city: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, actions) => {
      if (Object.keys(formik.errors).length > 0) {
        return toast({
          title: "An error occurred.",
          description: "Please fill all required fields",
          status: "error",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
      }
      //    create user in firebase

      try {
        const { user } = await createUserWithEmailAndPassword(
          clientAuth,
          values.email,
          values.password
        );
        // assign user role as employee
        await fetch("/api/assignUserRole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            role: "employee",
          }),
        });

        //   create user in firestore in employees collection
        const docRef = doc(db, "employees", user.uid);
        const filterdValues: Partial<typeof values> = values;
        delete filterdValues.confirmPassword;
        delete filterdValues.password;
        await setDoc(docRef, {
          ...filterdValues,
          uid: user.uid,
          isProfileComplete: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        updateProfile(user, {
          displayName: `${values.firstname} ${values.lastname}`,
        });
        const token = await user.getIdToken(true);
        createUserSession(token, logout);
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
        formik.resetForm();
        router.replace("/jobs");
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
        border={"1px solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Heading mb={"8"} textAlign={"center"} size={"lg"}>
          Sign up
        </Heading>
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
          <PersonalInfo formik={formik} />

          <Button
            isLoading={formik.isSubmitting}
            disabled={formik.isSubmitting}
            width={"full"}
            variant="outline"
            bg={bgButton}
            textColor="white"
            _hover={{
              bg: "brand.primaryDark",
            }}
            transitionDuration="0.3s"
            type="submit"
          >
            Signup
          </Button>
        </VStack>
      </Container>
    </Center>
  );
}

export default SignupPage;

const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastname: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  country: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
});
