"use client";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Skeleton,
  Spacer,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  VisuallyHidden,
  VStack,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore/lite";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";
import { db } from "../firebase";
import useUser from "../hooks/useUser";
import InputField from "./form/InputField";
import JobPosting from "./JobPosting/JobPosting";
import SelecLocation from "./SelectMenu";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <Skeleton height="200px" />,
});

function PostJobForm() {
  const toast = useToast();

  const bgForm = useColorModeValue("gray.50", "gray.700");
  const { user } = useUser();
  const [preview, setPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      jobDescription: "",
      jobType: "",
      city: "",
      country: "",
      minJobSalary: "",
      maxJobSalary: "",
      skills: [] as string[],
      jobExperience: "",
      company: "",
      companyEmail: "",
      isRemote: false,
    },
    validationSchema: Yup.object({
      jobTitle: Yup.string().required("Required"),
      jobDescription: Yup.string().required("Required"),
      jobType: Yup.string().required("Required"),
      isRemote: Yup.boolean(),
      city: Yup.string().when("isRemote", {
        is: false,
        then: Yup.string().required("Required"),
      }),
      country: Yup.string().when("isRemote", {
        is: false,
        then: Yup.string().required("Required"),
      }),
      minJobSalary: Yup.number().positive().required("Required"),
      maxJobSalary: Yup.number()
        .positive()
        .moreThan(
          Yup.ref("minJobSalary"),
          "Max salary must be greater than min salary"
        )
        .required("Required"),
      jobExperience: Yup.number().positive().required("Required"),
      skills: Yup.array().of(Yup.string()).required("Required"),
    }),
    onSubmit: async (values, actions) => {
      if (!user) return;
      try {
        await addDoc(collection(db, "job_postings"), {
          ...values,
          companyid: user.uid,
          createdAt: serverTimestamp(),
        });
        toast({
          title: "Job posted",
          description: "Your job has been posted",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        formik.resetForm();
        setSkills([]);
        setPreview(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        actions.setSubmitting(false);
      }
    },
  });
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>(formik.values.skills);
  const skillsRef = useRef<HTMLInputElement>(null);
  const addSkill = (skill: string) => {
    if (!skill) return;
    const skillsSet = new Set(skills);
    if (skillsSet.has(skill)) {
      return;
    }
    setSkills([...skills, skill]);
    formik.setValues({
      ...formik.values,
      skills: [...skills, skill],
    });
    if (skillsRef.current && skillsRef.current.value) {
      skillsRef.current.value = "";
    }
  };
  const removeSkill = (skill: string) => {
    const skillsSet = new Set(skills);
    if (!skillsSet.has(skill)) {
      return;
    }
    skillsSet.delete(skill);
    setSkills(Array.from(skillsSet));
    formik.setValues({
      ...formik.values,
      skills: Array.from(skillsSet),
    });
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      addSkill(e.target.value);
    }
  };

  // preview job posting before submit
  const postForReview = async () => {
    // validate form before preview

    if (!user) return;
    setLoadingPreview(true);
    const q = query(collection(db, "company"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const company = querySnapshot.docs[0].data();
    await formik.setFieldValue("company", company.name);
    await formik.setFieldValue("companyEmail", company.email);
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        jobTitle: true,
        jobDescription: true,
        jobType: true,
        city: true,
        country: true,
        minJobSalary: true,
        maxJobSalary: true,
        jobExperience: true,
        skills: true,
      });
      if (!formik.values.skills.length) {
        setSkillsError("Please add at least one skill");
      }
      setLoadingPreview(false);
      return toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    // show preview
    setPreview(true);
    setLoadingPreview(false);
   
  };
useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: "smooth" });
    }
}, [preview]);
  return (
    <Center>
      <div
        className={`grid lg:p-10 ${
          preview ? "lg:grid-cols-2" : "grid-cols-1"
        } items-start gap-6`}
      >
        <Container
          bg={bgForm}
          px={12}
          py={8}
          className=" w-full space-y-5 lg:shadow-md rounded-xl"
        >
          <Heading as={"h1"} size="xl" className="text-primary text-center m-8">
            Post Job
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
              name={"jobTitle"}
              label={"Job Title"}
              placeholder="Full Stack Developer"
              isRequired
            />
            <FormControl
              isRequired
              isInvalid={formik.touched.jobType && !!formik.errors.jobType}
            >
              <FormLabel>Job Type</FormLabel>
              <Select
                {...formik.getFieldProps("jobType")}
                placeholder="Select Job Type"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Intership">Intership</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </Select>
              <FormErrorMessage>{formik.errors.jobType}</FormErrorMessage>
            </FormControl>
            <HStack align={"start"}>
              <InputField
                formik={formik}
                name={"minJobSalary"}
                label={"Salary From"}
                placeholder="50000"
                type={"number"}
                isRequired
              />
              <InputField
                formik={formik}
                name={"maxJobSalary"}
                label={"Salary To"}
                placeholder="100000"
                type={"number"}
                isRequired
              />
            </HStack>
            <VStack width={"full"}>
              <Flex flexWrap={"wrap"}>
                {skills?.map((skill) => (
                  <>
                    <Tag
                      size={"lg"}
                      key={skill}
                      borderRadius="full"
                      variant="solid"
                      m={1}
                    >
                      <TagLabel>{skill}</TagLabel>
                      <TagCloseButton onClick={() => removeSkill(skill)} />
                    </Tag>
                    <Spacer />
                  </>
                ))}
              </Flex>
              <FormControl isInvalid={!!skillsError} isRequired={true}>
                <FormLabel fontWeight={"bold"} alignSelf={"start"}>
                  Skills
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    placeholder="Add your skills"
                    ref={skillsRef}
                    required
                    onKeyDown={handleKeyDown}
                    {...formik.getFieldProps("skills")}
                    value={skillsRef.current?.value || ""}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => addSkill(skillsRef.current?.value || "")}
                    >
                      Add
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{skillsError}</FormErrorMessage>
              </FormControl>
            </VStack>
            <InputField
              formik={formik}
              name={"jobExperience"}
              label={"Years of Experience"}
              placeholder="2"
              type={"number"}
              isRequired
            />
            <FormControl isRequired={true}>
              <FormLabel fontWeight={"bold"} alignSelf={"start"}>
                Job Description
              </FormLabel>
              <Box
                w={"full"}
                rounded={"lg"}
                overflow={"hidden"}
                textColor={useColorModeValue("gray.800", "black")}
                borderWidth={
                  formik.errors.jobDescription && formik.touched.jobDescription
                    ? 2
                    : 0
                }
                borderColor={
                  formik.errors.jobDescription && formik.touched.jobDescription
                    ? "red.400"
                    : "gray.300"
                }
              >
                <ReactQuill
                  theme="snow"
                  value={formik.values.jobDescription}
                  onChange={(value) => {
                    formik.setFieldValue("jobDescription", value);
                  }}
                  style={{
                    backgroundColor: useColorModeValue("white", "#A0AEC0"),
                  }}
                  onBlur={() => {
                    formik.setTouched({ jobDescription: true });
                  }}
                />
              </Box>
              <Text
                display={
                  formik.errors.jobDescription && formik.touched.jobDescription
                    ? "block"
                    : "none"
                }
                fontSize={"sm"}
                color={"red.400"}
                alignSelf={"start"}
              >
                {formik.errors.jobDescription}
              </Text>
            </FormControl>
            <VStack align={"end"}>
              <Checkbox
                isChecked={formik.values.isRemote}
                {...formik.getFieldProps("isRemote")}
              >
                Remote
              </Checkbox>
              {formik.values.isRemote ? null : (
                <SelecLocation
                  setValue={formik.setValues}
                  value={formik.values}
                  formikProps={formik}
                />
              )}
            </VStack>
            <Button
              isLoading={formik.isSubmitting || loadingPreview}
              disabled={formik.isSubmitting || loadingPreview}
              width={"full"}
              variant="solid"
              colorScheme="teal"
              transitionDuration="0.3s"
              onClick={postForReview}
              type="button"
            >
              Post Job
            </Button>
          </VStack>
        </Container>
        {preview ? (
          <Container
          ref={previewRef}
            bg={bgForm}
            className=" w-full space-y-5 p-8 shadow-md rounded-xl "
          >
            <Heading
              textAlign={"center"}
              fontWeight={"bold"}
              fontSize={"3xl"}
              className="mt-10"
              textTransform={"capitalize"}
            >
              Job post preview <Icon as={ViewIcon} />
            </Heading>
            <JobPosting {...formik.values} />
            <Button
              width={"full"}
              variant="outline"
              isLoading={formik.isSubmitting}
              disabled={formik.isSubmitting}
              colorScheme="teal"
              transitionDuration="0.3s"
              _hover={{ bg: "teal.500", color: "white" }}
              onClick={formik.submitForm}
              type="button"
            >
              Confirm Job Post
            </Button>
          </Container>
        ) : null}
      </div>
    </Center>
  );
}

export default PostJobForm;
