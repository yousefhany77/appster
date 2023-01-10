"use client";
import {
    Button,
    Center,
    Container,
    Heading,
    HStack,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore/lite";
import { useFormik } from "formik";
import { Dispatch, FC, FormEvent,  SetStateAction, useState } from "react";
import * as Yup from "yup";
import CareerInfo from "../../../components/form/employee/CareerInfo";
import EducationInfo from "../../../components/form/employee/EducatinInfo";
import { clientAuth, db } from "../../../firebase";
import { useToast } from "@chakra-ui/react";
import PersonalInfo from "../../../components/form/employee/PersonalInfo";

function SignupPage() {
    const [steps, setSteps] = useState(1);
    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
            country: "",
            city: "",
            jobTitle: "",
            company: "",
            about: "",
            time: {
                from: "",
                to: "",
            },
            skills: [],

            university: "",
            degree: "",
            field: "",
            from: "",
            to: "",
        },
        validationSchema: SignupSchema,
        onSubmit: async (values, actions) => {
            //    create user in firebase

            try {
                const {
                    user: { uid },
                } = await createUserWithEmailAndPassword(
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
                        uid,
                        role: "employee",
                    }),
                });
                //   create user in firestore in employees collection
                const docRef = doc(db, "employees", uid);
                const filterdValues: Partial<typeof values> = values;
                delete filterdValues.confirmPassword;
                delete filterdValues.password;
                await setDoc(docRef, {
                    ...filterdValues,
                    uid,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                toast({
                    title: "Account created.",
                    description: "We've created your account for you.",
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
    const bgForm = useColorModeValue("gray.50", "gray.700");
    const bgButton = useColorModeValue("gray.300", "gray.800");
    const handleSumbit = (e: FormEvent<HTMLDivElement>): void => {
        e.preventDefault();
        if (Object.keys(formik.errors).length === 0) {
            formik.submitForm();
        } else {
            toast({
                title: "An error occurred.",
                description: "Please fill all required fields",
                status: "error",
                duration: 7000,
                isClosable: true,
                position: "top",
            });
        }
    }
    return (
        <Center p={10}>
            <Container bg={bgForm} className=" w-full space-y-5 shadow-md rounded-xl">
                <div className="  p-8">
                    <Heading as={"h1"} size="xl" className="text-primary text-center m-8">
                        Sign Up
                    </Heading>

                    <VStack
                        as="form"
                        mx="auto"
                        spacing={4}
                        justifyContent="start"
                        autoComplete="off"
                        onSubmit={handleSumbit}
                        onKeyDown={(e) => {
                            e.key === "Enter" && e.preventDefault();
                        }}
                    >
                        {steps === 1 && <PersonalInfo formik={formik} />}
                        {steps === 2 && <CareerInfo formik={formik} />}
                        {steps === 3 && <EducationInfo formik={formik} />}
                        <HStack justifyContent="space-between" w={"full"}>
                            <Button
                                variant="outline"
                                bg={bgButton}
                                _hover={{
                                    bg: "brand.primary",
                                    textColor: "white",
                                }}
                                transitionDuration="0.3s"
                                onClick={() => setSteps(steps - 1)}
                                disabled={steps === 1}
                            >
                                Previous
                            </Button>
                            {steps !== 3 && (
                                <Button
                                    variant="outline"
                                    bg={bgButton}
                                    _hover={{
                                        bg: "brand.primary",
                                        textColor: "white",
                                    }}
                                    transitionDuration="0.3s"
                                    onClick={async () =>
                                        await validateStep(formik, steps, toast, setSteps)
                                    }
                                    disabled={steps === 3}
                                >
                                    Next
                                </Button>
                            )}

                            {steps === 3 && (
                                <Button
                                    variant="outline"
                                    bg={bgButton}
                                    disabled={formik.isSubmitting}
                                    _hover={{
                                        bg: "brand.primary",
                                        textColor: "white",
                                    }}
                                    transitionDuration="0.3s"
                                    type="submit"
                                >
                                    Sumbit
                                </Button>
                            )}
                        </HStack>
                    </VStack>
                </div>
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
    jobTitle: Yup.string().required("Required"),
    company: Yup.string().required("Required"),
    university: Yup.string().required("Required"),
    degree: Yup.string().required("Required"),
    field: Yup.string().required("Required"),
    from: Yup.string().required("Required"),
    to: Yup.string().required("Required"),
});

const validateStep = async (
    formik: any,
    steps: number,
    toast: any,
    setSteps: Dispatch<SetStateAction<number>>
): Promise<void> => {
    const errors = await formik.validateForm();
    console.log(steps);
    switch (steps) {
        case 1: {
            const isValid =
                errors.firstname === undefined &&
                errors.lastname === undefined &&
                errors.email === undefined &&
                errors.password === undefined &&
                errors.confirmPassword === undefined &&
                errors.country === undefined &&
                errors.city === undefined;
            console.log(isValid);
            if (isValid) {
                setSteps(steps + 1);
            } else {
                toast({
                    title: "An error occurred.",
                    description: "Please fill all required fields",
                    status: "error",
                    duration: 7000,
                    isClosable: true,
                    position: "top",
                });
            }
            break;
        }
        case 2:
            {
                const isValid =
                    errors.jobTitle === undefined && errors.company === undefined;
                if (isValid) {
                    setSteps(steps + 1);
                } else {
                    toast({
                        title: "An error occurred.",
                        description: "Please fill all required fields",
                        status: "error",
                        duration: 7000,
                        isClosable: true,
                        position: "top",
                    });
                }
            }
            break;

        case 3: {
            const isValid =
                errors.university === undefined &&
                errors.degree === undefined &&
                errors.field === undefined &&
                errors.from === undefined &&
                errors.to === undefined;
            if (isValid) {
                setSteps(steps + 1);
            } else {
                toast({
                    title: "An error occurred.",
                    description: "Please fill all required fields",
                    status: "error",
                    duration: 7000,
                    isClosable: true,
                    position: "top",
                });
            }

            break;
        }
    }
};
