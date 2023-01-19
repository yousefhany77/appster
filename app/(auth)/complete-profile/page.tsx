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

import { useToast } from "@chakra-ui/react";
import { setCookie } from "cookies-next";
import { User } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import * as Yup from "yup";
import CareerInfo from "../../../components/form/employee/CareerInfo";
import EducationInfo from "../../../components/form/employee/EducatinInfo";
import { clientAuth, db } from "../../../firebase";

function SignupPage() {
  const [steps, setSteps] = useState(1);
  const toast = useToast();
  const [user, setUser] = useState<User | null>(clientAuth.currentUser);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      company: "",
      about: "",
      workedFrom: "",
      workedTo: "",
      isStillWorking: false,
      skills: [],

      university: "",
      degree: "",
      field: "",
      from: "",
      to: "",
      isStillStudying: false,
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, actions) => {
      if (user && user.uid) {
        try {
          //   update user in firestore in employees collection

          const docRef = doc(db, "employees", user.uid);

          const employeeData = {
            experience: [
              {
                jobTitle: values.jobTitle,
                company: values.company,
                about: values.about,
                time: {
                  from: values.workedFrom,
                  to: values.workedTo,
                },
              },
            ],

            education: [
              {
                university: values.university,
                degree: values.degree,
                field: values.field,
                from: values.from,
                to: values.to,
              },
            ],
            skills: [...values.skills],
            updatedAt: serverTimestamp(),
          };
          await updateDoc(docRef, {
            experience: employeeData.experience,
            education: employeeData.education,
            skills: employeeData.skills,
            isProfileComplete: true,
            updatedAt: employeeData.updatedAt,
          });
          // add the job title in cookies get relevant jobs
          setCookie(
            "jobtitle",
            values.jobTitle
              .toLowerCase()
              ?.replace("junior", "")
              ?.replace("senior", "")
          );
          toast({
            title: "Account Updated.",
            description: "We've Updated your account for you.",
            status: "success",
            duration: 7000,
            isClosable: true,
            position: "top",
          });
          formik.resetForm();
          window.location.href = "/jobs";
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
  };
  useEffect(() => {
    clientAuth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);
  useEffect(() => {
    const checkIfProfileComplete = async (uid: string) => {
      const docRef = doc(db, "employees", uid);
      const docData = await getDoc(docRef);
      const isProfileComplete = docData.data()?.isProfileComplete;
      if (isProfileComplete) {
        toast({
          title: "An error occurred.",
          description: "You already Completed Your profile",
          status: "error",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
        router.push("/jobs");
      }
    };
    user && checkIfProfileComplete(user.uid);
  }, [user]);
  return (
    <Center p={10}>
      <Container bg={bgForm} className=" w-full space-y-5 shadow-md rounded-xl">
        <div className="  p-8">
          <Heading as={"h1"} size="xl" className="text-primary text-center m-8">
            Complete Your Profile
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
            {steps === 1 && <CareerInfo formik={formik} />}
            {steps === 2 && <EducationInfo formik={formik} />}
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
              {steps !== 2 && (
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
                  disabled={steps === 2}
                >
                  Next
                </Button>
              )}

              {steps === 2 && (
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
  jobTitle: Yup.string().required("Required"),
  company: Yup.string().required("Required"),
  university: Yup.string().required("Required"),
  degree: Yup.string().required("Required"),
  field: Yup.string().required("Required"),
  from: Yup.date()
    .max(new Date(), "Cannot use future date")
    .required("Required"),
  isStillStudying: Yup.boolean(),
  to: Yup.date()
    .transform((_, originalValue) => {
      const newValue = new Date().toDateString().replace(/\//g, "-");
      return originalValue === "Present" ? newValue : originalValue;
    })
    .when("isStillStudying", {
      is: false,
      then: Yup.date()
        .min(Yup.ref("from"), "To date must be greater than from date")
        .required("Required"),
    }),
  workedFrom: Yup.date()
    .max(new Date(), "Cannot use future date")
    .required("Required"),
  isStillWorking: Yup.boolean(),
  workedTo: Yup.date()
    .transform((_, originalValue) => {
      const newValue = new Date().toDateString().replace(/\//g, "-");
      return originalValue === "Present" ? newValue : originalValue;
    })
    .when("isStillWorking", {
      is: false,
      then: Yup.date()
        .max(
          new Date(),
          "Cannot use future date"
        )
        .min(Yup.ref("workedFrom"), "To date must be greater than from date")
        .required("Required"),
    }),
});

const validateStep = async (
  formik: any,
  steps: number,
  toast: any,
  setSteps: Dispatch<SetStateAction<number>>
): Promise<void> => {
  const errors = await formik.validateForm();
  switch (steps) {
    case 1:
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

    case 2: {
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
