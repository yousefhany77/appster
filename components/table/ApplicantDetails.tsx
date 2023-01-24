import { doc, getDoc } from "firebase/firestore/lite";
import React from "react";
import { db } from "../../firebase";
import useSWR from "swr";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Heading,
  Spinner,
  Tag,
  Text,
} from "@chakra-ui/react";
export interface IApplicant {
  firstname: string;
  lastname: string;
  email: string;
  country: string;
  city: string;
  education: [
    {
      university: string;
      degree: string;
      field: string;
      from: string;
      to: string;
    }
  ];
  experience: [
    {
      company: string;
      jobTitle: string;
      about: string;
      time: {
        from: string;
        to: string;
      };
    }
  ];
  skills: string[];
}
const getApplicant = async (uid: string) => {
  const docRef = doc(db, "employees", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as IApplicant;
  } else {
    throw new Error("Employee not Found!");
  }
};

function ApplicantDetails({ uid }: { uid: string }) {
  const { data, isLoading } = useSWR(`applicants/details/${uid}`, () =>
    getApplicant(uid)
  );
  if (isLoading)
    return (
      <Container>
        <Spinner />
      </Container>
    );
  if (data) {
    console.log({ employee: data });
    // return null;
    return (
      <Container>
        <p className="my-2">
          {data.city}, {data.country}
        </p>
        <Accordion my="4" allowToggle allowMultiple>
          <AccordionItem py="1">
            <Heading size="md">
              <AccordionButton _expanded={{ bg: "teal.400", color: "white" }}>
                <Box as="span" flex="1" textAlign="left">
                  Work Experience
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel p={4}>
              {data.experience?.map((exp) => (
                <Box my={"3"} shadow="sm" key={crypto?.randomUUID.toString()}>
                  <Heading as={"h3"} size="sm">
                    {exp.company}
                  </Heading>
                  <p>{exp.jobTitle}</p>
                  <p>{exp.about}</p>
                  <p>
                    {exp.time.from} - {exp.time.to}
                  </p>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem py="1">
            <Heading size="md">
              <AccordionButton _expanded={{ bg: "teal.400", color: "white" }}>
                <Box as="span" flex="1" textAlign="left">
                  Education
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel p={4}>
              {data.education?.map((edu) => (
                <Box my={"3"} shadow="sm" key={crypto?.randomUUID.toString()}>
                  <Heading as={"h3"} size="sm">
                    {edu.university}
                  </Heading>
                  <p>{edu.degree}</p>
                  <p>{edu.field}</p>
                  <p>
                    {edu.from} - {edu.to}
                  </p>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Box>
          <Heading as={"h3"} size="md" my="4">
            Skills
          </Heading>
          {Array.isArray(data.skills) && (
            <Text pt="2">
              {data.skills.map((skill) => (
                <Tag
                  key={skill}
                  size="md"
                  variant="solid"
                  colorScheme={"teal"}
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
          )}
        </Box>
      </Container>
    );
  } else return <Container>Not Found</Container>;
}

export default ApplicantDetails;
