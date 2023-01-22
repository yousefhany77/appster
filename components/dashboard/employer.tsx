"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Select,
  SimpleGrid,
  Spinner,
  Tag,
  Text,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCode,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBill,
} from "react-icons/fa";
import useSWR from "swr";
import { db } from "../../firebase";
import useUser from "../../hooks/useUser";
function EmployerDashboard() {
  const { user, userRole } = useUser();
  const bg = useColorModeValue("gray.200", "gray.700");
  const [sortingMethod, setSortingMethod] = useState<
    "applicantsCount" | "applicantsCount_desc" | null
  >(null);
  const { data, isLoading, mutate } = useSWR(
    `dashboard/${user?.uid}`,
    () => user && getJobPostings(user.uid),
    {
      onSuccess: (data) => {
        if (sortingMethod && data) {
          sortJobPostings(sortingMethod);
          return;
        }
        setJobPostings(data);
      },
    }
  );
  const [jobPostings, setJobPostings] = useState<
    TJobPostings | null | undefined
  >(data);
  function sortJobPostings(key: "applicantsCount" | "applicantsCount_desc") {
    if (!jobPostings) return;
    if (key === "applicantsCount") {
      setJobPostings([
        ...jobPostings.sort((a, b) => a.applicantsCount - b.applicantsCount),
      ]);
    }
    if (key === "applicantsCount_desc") {
      setJobPostings([
        ...jobPostings.sort((a, b) => b.applicantsCount - a.applicantsCount),
      ]);
    }

    return;
  }
  useEffect(() => {
    if (sortingMethod) {
      sortJobPostings(sortingMethod);
    } else {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortingMethod]);
  if (isLoading || !user)
    return (
      <Container>
        <Heading my={"8"} textAlign="center">
          Job Postings
        </Heading>
        <Spinner mx={"auto"} display="block" />
      </Container>
    );
  if (userRole === "employee" && !isLoading) {
    return (
      <Container maxW={"container.xl"}>
        <Heading my={"8"} textAlign="center">
          Job Postings
        </Heading>
        <Text textAlign="center">
          You are not an employer.{" "}
          <Link className="block my-4 font-bold text-primary" href={"/company"}>
            Register Company <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
      </Container>
    );
  }
  if (jobPostings?.length === 0 && !isLoading) {
    return (
      <Container maxW={"container.xl"}>
        <Heading my={"8"} textAlign="center">
          Job Postings
        </Heading>

        <Text textAlign="center">
          You have not posted any jobs yet.{" "}
          <Link className="block my-4 font-bold text-primary" href={"/postjob"}>
            Post Job <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
      </Container>
    );
  }

  return (
    <Container maxW={"container.xl"}>
      <Heading my={"8"} textAlign="center">
        Job Postings
      </Heading>

      <Select
        w={"fit-content"}
        ml={"auto"}
        my={"4"}
        mr={"4"}
        placeholder="Select option"
        onChange={(e) => {
          if (e.target.value === "asc_count") {
            setSortingMethod("applicantsCount");
          } else if (e.target.value === "desc_count") {
            setSortingMethod("applicantsCount_desc");
          } else {
            setSortingMethod(null);
          }
        }}
      >
        <option value="asc_count">Job Applications (ASC)</option>
        <option value="desc_count">Job Applications (DESC)</option>
      </Select>
      <SimpleGrid minChildWidth={"sm"} spacing="4">
        {jobPostings?.map((job) => (
          <Link
            href={`/dashboard/jobs/${job.id}`}
            key={crypto?.randomUUID().toString()}
            className="h-full"
          >
            <Box
              maxWidth={"sm"}
              p={8}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              rounded={"md"}
              borderColor={bg}
              w="100%"
              h={"full"}
              mx="auto"
              _hover={{
                cursor: "pointer",
                shadow: "md",
                backgroundColor: bg,
              }}
            >
              <Heading
                fontSize="xl"
                className="flex items-center justify-between gap-3"
              >
                {job.jobTitle}{" "}
                <Tag
                  title="Applicants Count"
                  textAlign="center"
                  size="md"
                  padding="0.5rem"
                  colorScheme="teal"
                  variant="outline"
                >
                  {job.applicantsCount}
                </Tag>
              </Heading>
              <Text>
                {moment(
                  new Date(
                    job.createdAt.seconds * 1000 ||
                      (job.createdAt as unknown as string)
                  )
                ).fromNow()}
              </Text>
              <List spacing={3} mt="3.5">
                {job.country && (
                  <ListItem>
                    <ListIcon as={FaMapMarkerAlt} color="teal.400" />
                    {job.country} - {job.city}
                  </ListItem>
                )}
                <ListItem>
                  <ListIcon as={FaHome} color="teal.400" />
                  Remote
                </ListItem>
                <ListItem>
                  <ListIcon as={FaBriefcase} color="teal.400" />
                  {job.jobType}
                </ListItem>
                <ListItem>
                  <ListIcon as={FaMoneyBill} color="teal.400" />
                  {job.maxJobSalary}
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCode} color="teal.400" />
                  {job.jobExperience} Years
                </ListItem>
              </List>
              <Text mt="3.5">
                {job.jobDescription
                  .split(" ")
                  .slice(0, 45)
                  .join(" ")
                  .replaceAll(/<[^>]+>/g, "")
                  .concat("...")}
              </Text>
              <Heading mt="3.5" fontSize="md">
                Skills
              </Heading>
              <Text pt="2" fontSize="lg" mt="3.5">
                {job.skills.map((skill) => (
                  <Tag
                    key={skill}
                    size="md"
                    variant="outline"
                    p={2}
                    paddingInline={"4"}
                    borderRadius="full"
                    mr="2"
                    mb="2"
                  >
                    {skill}
                  </Tag>
                ))}
              </Text>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default EmployerDashboard;

const getJobPostings = async (userId: string): Promise<TJobPostings> => {
  const collectionRef = collection(db, "company", userId, "job_postings");
  const jobPostingsRef = await (
    await getDocs(collectionRef)
  ).docs.map((jobPost) => doc(db, "job_postings", jobPost.id));
  const jobPostings = await Promise.all(
    jobPostingsRef.map((ref) =>
      getDoc(ref).then(async (doc) => {
        return {
          ...doc.data(),
          applicantsCount: await getApplicantsCount(doc.id),
          id: doc.id,
        };
      })
    )
  );
  if (jobPostings && jobPostings.length === 0) return [];
  return jobPostings as TJobPostings;
};

const getApplicantsCount = async (jobId: string) => {
  const docRef = collection(db, "job_postings", jobId, "applications");
  const snapshot = await getDocs(docRef);
  return snapshot.size;
};

type TJobPostings = IJobPosting[];

interface IJobPosting {
  id: string;
  applicantsCount: number;
  jobDescription: string;
  companyEmail: string;
  skills: string[];
  createdAt: CreatedAt;
  maxJobSalary: number;
  city: string;
  minJobSalary: number;
  country: string;
  jobExperience: number;
  companyid: string;
  jobTitle: string;
  isRemote: boolean;
  company: string;
  jobType: string;
}

interface CreatedAt {
  seconds: number;
  nanoseconds: number;
}
