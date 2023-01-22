"use client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Textarea,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore/lite";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsFillCloudUploadFill } from "react-icons/bs";
import * as Yup from "yup";
import { clientAuth, db } from "../firebase";
import useStorageUpload from "../hooks/useStorageUpload";
import useUser from "../hooks/useUser";
import EditableTextField from "./EditableTextField";

function JobApplication({ jobId }: { jobId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUser();
  const { upload, uploadProgress, validateFile } = useStorageUpload();
  const toast = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const uploadButtonHandler = () => {
    if (fileRef.current) fileRef.current.click();
  };
  const formik = useFormik({
    initialValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      coverletter: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      coverletter: Yup.string()
        .min(100, "Please write More")

        .max(900, "Max length 900 character")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        if (!user)
          return toast({
            title: "Error",
            description: "Please login to apply for this job",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
        const resumeLink =
          resumeFile && user && (await upload(resumeFile, user.uid, "resumes"));
        await applyForJob({
          jobId,
          coverLetter: values.coverletter,
          resumeLink: resumeLink,
          name: values.name,
          email: values.email,
        });
        toast({
          title: "Application Submitted.",
          description: "We've submitted your application to the company.",
          status: "success",
          duration: 5000,
          position: "top",

          isClosable: true,
        });
        formik.resetForm();
        onClose();
      } catch (error: any) {
        if (
          error.message ===
          "You must complete your profile before applying for a job"
        ) {
          router.push("/complete-profile");
        }
        if (error.message === "Please login to apply for this job") {
          router.push("/login");
        }
        toast({
          title: "Error",
          description: error.message || error.code || "Something went wrong",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    },
  });

  useEffect(() => {
    if (!user) return;
    formik.handleChange({ target: { name: "name", value: user.displayName } });
    formik.handleChange({ target: { name: "email", value: user.email } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const modalSize = useBreakpointValue(
    {
      lg: `2xl`,
      base: `full`,
    },
    {
      // Breakpoint to use when mediaqueries cannot be used, such as in server-side rendering
      // (Defaults to 'base')
      fallback: "lg",
      ssr: true,
    }
  );
  return (
    <>
      <Button
        colorScheme={"teal"}
        variant={"solid"}
        onClick={onOpen}
        rounded={"lg"}
        className="w-full  lg:w-auto "
      >
        Apply
      </Button>

      <Modal
        closeOnOverlayClick={!formik.isSubmitting}
        isOpen={isOpen}
        motionPreset="scale"
        onClose={() => {
          if (!formik.isSubmitting) onClose();
          formik.resetForm();
        }}
        size={modalSize}
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent padding={"4"}>
          <ModalHeader
            textAlign={"center"}
            fontSize={"3xl"}
            fontWeight={"bold"}
          >
            Job Application
          </ModalHeader>
          {<ModalCloseButton />}
          <ModalBody>
            <EditableTextField
              name="email"
              formik={formik}
              defaultValue={formik.values.email}
            />
            <EditableTextField
              name="name"
              formik={formik}
              defaultValue={formik.values.name}
            />
            <FormControl
              isRequired
              isInvalid={
                formik.touched.coverletter && !!formik.errors.coverletter
              }
            >
              <FormLabel
                fontWeight={"bold"}
                fontSize={"lg"}
                color={useColorModeValue("gray.600", "gray.200")}
                textTransform={"capitalize"}
                mt={"6"}
              >
                Describe your character in a couple of sentences.
              </FormLabel>
              <Textarea
                isRequired
                isInvalid={
                  formik.touched.coverletter && !!formik.errors.coverletter
                }
                placeholder="Here is a sample placeholder"
                {...formik.getFieldProps("coverletter")}
              />{" "}
              <FormErrorMessage>{formik.errors.coverletter}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel
                fontWeight={"bold"}
                fontSize={"lg"}
                color={useColorModeValue("gray.600", "gray.200")}
                textTransform={"capitalize"}
                mt={"6"}
              >
                Your Resume
              </FormLabel>
              <Progress
                my={2}
                value={uploadProgress}
                size="md"
                rounded={"md"}
                display={uploadProgress ? "block" : "none"}
                colorScheme="teal"
              />
              <Button
                my={2}
                rightIcon={<BsFillCloudUploadFill />}
                colorScheme="teal"
                onClick={uploadButtonHandler}
                variant="outline"
                w={"100%"}
              >
                {resumeFile?.name || "Upload Resume"}
              </Button>
              <Input
                display={"none"}
                ref={fileRef}
                type={"file"}
                accept="application/pdf, .doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      validateFile(file, "resumes");
                      setResumeFile(file);
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description: error.message,
                        status: "error",
                        isClosable: true,
                        duration: 5000,
                        position: "top",
                      });
                      e.target.value = "";
                    }
                  }
                }}
              />
              <FormHelperText>
                Upload your resume in PDF, DOC or DOCX format.
              </FormHelperText>
              <FormHelperText className="my-2">
                If you do not have a resume, we will send your application to
                the company together with your work experience and education
                section in your account.
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={formik.isSubmitting}
              onClick={formik.submitForm}
              variant="solid"
              colorScheme="teal"
              w={"100%"}
            >
              Sumbit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

interface IJobApplication {
  jobId: string;
  name: string;
  email: string;
  coverLetter: string;
  resumeLink: string | undefined | null;
}

const applyForJob = async ({
  email,
  jobId,
  name,
  resumeLink,
  coverLetter,
}: IJobApplication) => {
  // check if user is logged in
  const user = clientAuth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to apply for a job");
  }
  // check if user profile is complete
  // check if the job exists
  const [employee, job] = await Promise.all([
    getDoc(doc(db, "employees", user.uid)),
    getDoc(doc(db, "job_postings", jobId)),
  ]);

  const isProfileComplete = employee.data()?.isProfileComplete;
  if (!isProfileComplete) {
    throw new Error("You must complete your profile before applying for a job");
  }
  if (!job.exists()) {
    throw new Error("Job does not exist");
  }
  // check if user has already applied for this job
  const jobApplication = doc(
    db,
    "job_postings",
    jobId,
    "applications",
    user.uid
  );
  const querySnapshot = await getDoc(jobApplication);
  if (querySnapshot.exists()) {
    throw new Error("You have already applied for this job");
  }

  // add application to job posting
  const application = {
    jobId,
    userId: user.uid,
    status: "pending",
    name,
    email,
    coverLetter,
    resumeLink,
    createdAt: serverTimestamp(),
  };
  const docRef = await setDoc(jobApplication, application);
  // add application to user
  const userApplications = collection(
    db,
    "employees",
    user.uid,
    "applications"
  );
  await addDoc(userApplications, {
    ...application,
    company: job.data().company,
    jobTitle: job.data().jobTitle,
  });
};

export default JobApplication;
