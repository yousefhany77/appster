"use client";
import {
  As,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  StackDivider,
  Tag,
  Text,
  UnorderedList,
  useColorModeValue,
} from "@chakra-ui/react";
import parse, {
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import millify from "millify";
import { usePathname } from "next/navigation";
import JobApplication from "../JobApplication";

export interface IJobPosting {
  jobId?: string;
  jobTitle: string;
  jobType: string;
  minJobSalary: string;
  maxJobSalary: string;
  skills: string[];
  jobExperience: string;
  jobDescription: string;
  isRemote?: boolean;
  city?: string;
  country?: string;
  company?: string;
  className?: string;
}
const JobPosting = ({
  jobId,
  jobTitle,
  jobType,
  minJobSalary,
  maxJobSalary,
  skills = [],
  jobExperience,
  jobDescription,
  isRemote,
  city,
  country,
  company,
  className,
}: IJobPosting) => {
  const bgCard = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "transparent");
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      const heading = ["h1", "h2", "h3", "h4", "h5", "h6"];
      if (domNode instanceof Element && domNode.attribs) {
        if (heading.includes(domNode.tagName.toLowerCase())) {
          return (
            <Heading as={domNode.tagName as As<any>} size={"md"} my={2}>
              {domToReact(domNode.children)}
            </Heading>
          );
        } else if (domNode.tagName.toLowerCase() === "p") {
          return (
            <Text
              fontSize={"md"}
              fontWeight={"normal"}
              lineHeight={"tall"}
              my={2}
            >
              {domToReact(domNode.children)}
            </Text>
          );
        } else if (domNode.tagName.toLowerCase() === "ul") {
          return (
            <UnorderedList m={2} ml={"6"}>
              {domToReact(domNode.children)}
            </UnorderedList>
          );
        } else if (domNode.tagName.toLowerCase() === "li") {
          return <ListItem>{domToReact(domNode.children)}</ListItem>;
        } else if (domNode.tagName.toLowerCase() === "ol") {
          return (
            <OrderedList m={2} ml={"6"}>
              {domToReact(domNode.children)}
            </OrderedList>
          );
        }
      }
    },
  };
  const pathname = usePathname();
  return (
    <Card
      shadow={pathname === "/postjob" ? "none" : "lg"}
      border={"1px solid"}
      bg={bgCard}
      borderColor={borderColor}
      p={6}
      className={`w-full  rounded-xl ${className}`}
    >
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4" maxH={"80vh"}>
          <Box position={"relative"}>
            <Heading size="md" textTransform="capitalize">
              {jobTitle}
            </Heading>
            <Text fontSize="md" textTransform="capitalize" textColor="gray.500">
              {company}
            </Text>
            <Text pt="2" fontSize="md">
              <Text>
                <span className="font-bold mr-2">Job Type:</span>
                {jobType}
              </Text>
              <Text>
                <span className="font-bold mr-2">Salary:</span>$
                {millify(+minJobSalary)} - ${millify(+maxJobSalary)}
              </Text>
              <Text>
                <span className="font-bold mr-2">Job Experience:</span>
                {typeof +jobExperience === "number"
                  ? `${jobExperience} years`
                  : jobExperience
  }
              </Text>
              <Text>
                <span className="font-bold mr-2">Remote:</span>
                {isRemote ? "Yes" : "No"}
              </Text>
              {isRemote ? null : (
                <Text fontWeight={"bold"}>
                  Location:{" "}
                  {isRemote ? null : (
                    <span className="font-normal mr-2">
                      {`${city}, ${country}`}
                    </span>
                  )}
                </Text>
              )}
            </Text>
            {pathname === "/jobs" && jobId && (
              <Box position={"absolute"} bottom={"0"} right={"0"}>
                <JobApplication jobId={jobId} />
              </Box>
            )}
          </Box>
          <Box>
            <Heading size="md" textTransform="uppercase">
              skills required {" "}
            </Heading>

            {Array.isArray(skills) && (
              <Text pt="2">
                {skills.map((skill) => (
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
          <Box
            overflowY={"scroll"}
            scrollBehavior={"smooth"}
            scrollPadding={"2rem"}
            scrollMargin={"2rem"}
          >
            <Heading size="md" textTransform="uppercase">
              Full Job Description
            </Heading>
            <Text pt="2" fontSize="sm">
              {parse(jobDescription, options)}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default JobPosting;
