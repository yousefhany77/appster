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
import { doc, setDoc } from "firebase/firestore/lite";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { db } from "../../../firebase";
import useUser from "../../../hooks/useUser";
import createUserSession from "../../../util/CreateUserSession";
import logout from "../../../util/logout";
import SelecLocation from "../../SelectMenu";
import InputField from "../InputField";

function RegisterCompany() {
  const toast = useToast();
  const bgForm = useColorModeValue("gray.50", "gray.700");
  const bgButton = useColorModeValue("brand.primary", "gray.800");
  const { user } = useUser();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      country: "",
      city: "",
    },
    validationSchema: companySchema,
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
      if (!user) return;
      try {
        // assign user role as employee
        await fetch("/api/assignUserRole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            role: "company",
          }),
        });
    
        //   create user in firestore in employees collection
        const docRef = doc(db, "company", user.uid);
        await setDoc(docRef, {
          name: values.name,
          email: values.email,
          location: {
            country: values.country,
            city: values.city,
          },

          uid: user.uid,
          adminEmail: user.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        const token = await user.getIdToken(true);
        createUserSession(token, logout);
        window.location.href = "/postjob";
        toast({
          title: "Company Registered.",
          description: "We've registered your company for you.",
          status: "success",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
        formik.resetForm();
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
        <Heading as={"h1"} size="xl" className="text-primary text-center m-8">
          Register Company
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
          <InputField
            formik={formik}
            name={"name"}
            label={"Company Name"}
            placeholder="Appster"
            isRequired
          />
          <InputField
            formik={formik}
            name={"email"}
            label={"Company Jobs Email"}
            placeholder="jobs@appster.com"
            isRequired
          />
          <SelecLocation
            setValue={formik.setValues}
            value={formik.values}
            formikProps={formik}
          />

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
            Register Company
          </Button>
        </VStack>
      </Container>
    </Center>
  );
}

export default RegisterCompany;

const companySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  country: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
});
