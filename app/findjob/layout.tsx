"use client";

import {
  Box,
  Container,
  Heading,
  HStack,
  Input,
  List,
  ListIcon,
  ListItem,
  Tag,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useOutsideClick,
  VStack,
} from "@chakra-ui/react";
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";

import moment from "moment";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBriefcase, FaCode, FaHome, FaMapMarkerAlt } from "react-icons/fa";
import {
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch-hooks-web";
import { Hit } from "../../algolia";
import { FacetDropdown } from "../../components/filters/FacetDropdown";
import useDebounce from "../../hooks/useDebounce";
const algoliaClient = algoliasearch(
  "8MYY53TECO",
  "ca83bd3c2b393565409a9fd9b9e6fce1"
);

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <InstantSearch searchClient={algoliaClient} indexName="job_postings">
      {/* searchbar with auto complete */}
      <SearchBox />
      {/* Filters */}
      <Container p={"5"} mx={"auto"} as="div">
        <HStack className="gap-2">
          <FacetDropdown>
            <RefinementList attribute="skills" />
          </FacetDropdown>
          <FacetDropdown>
            <RefinementList attribute="skills" />
          </FacetDropdown>
          <FacetDropdown>
            <RefinementList attribute="skills" />
          </FacetDropdown>
        </HStack>
      </Container>

      <Container maxWidth={"80%"} className=" max-h-screen ">
        <HStack
          alignItems={"start"}
          spacing={"5"}
          w={"100%"}
          p={"5"}
          className="relative"
        >
          <Box w={"50%"}>
            <JobHits />
          </Box>
          <Box w={"50%"} className="sticky top-10 ">
            {children}
          </Box>
        </HStack>
        <Pagination
          classNames={{
            root: useColorModeValue("white mx-auto text-black", "gray.700 mx-auto text-white"),
          }}
        />
      </Container>
    </InstantSearch>
  );
}

export default Layout;

function SearchBox({ ...props }) {
  const { refine } = useSearchBox(props);
  const { results } = useInstantSearch();
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useOutsideClick({
    ref: ref,
    handler: () => setIsModalOpen(false),
  });
  const boxBG = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const value = useDebounce({ value: query, delay: 300 });
  useEffect(() => {
    refine(value);
    setIsModalOpen(true);
  }, [value]);

  const { hits } = useHits(props);

  const uniqueHits = hits.reduce((acc: any, hit: any) => {
    //  unique hits by job title
    const isUnique = acc.find((accHit: any) => {
      return accHit.jobTitle === hit.jobTitle;
    });
    if (!isUnique) {
      acc.push(hit);
    }
    return acc;
  }, []);
  return (
    <Container p={5} mx={"auto"} as="div" position={"relative"}>
      <Input
        placeholder="Search by job title or skills"
        mx={"auto"}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      {!results.nbHits || !isModalOpen || !query ? null : (
        <Box
          bg={boxBG}
          textColor={textColor}
          className="my-3 ais-Hits"
          ref={ref}
          maxW={"container.md"}
          position={"absolute"}
          width="100%"
          zIndex={999}
        >
          <List className="ais-Hits-list">
            {uniqueHits.map((hit: any) => {
              return (
                <ListItem key={hit.objectID} className="ais-Hits-item">
                  <AutocompleteHit
                    key={hit.objectID}
                    hit={hit}
                    setQuery={(query) => {
                      setQuery(query);
                      setIsModalOpen(false);
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}
    </Container>
  );
}
function AutocompleteHit({
  hit,
  setQuery,
}: {
  hit: any;
  setQuery: (value: string) => void;
}) {
  const { _highlightResult, jobTitle, skills } = hit as Hit;
  // check hit _highlightResult

  if (_highlightResult.jobTitle.matchLevel !== "none") {
    return (
      <Text>
        <Highlight
          hit={hit}
          onClick={() => setQuery(jobTitle)}
          attribute="jobTitle"
        />
      </Text>
    );
  } else if (
    _highlightResult.skills.find((skill) => skill.matchLevel !== "none")
  ) {
    const highlightedSkill = _highlightResult.skills.find((skill) => {
      return skill.matchLevel !== "none";
    });
    const highlightedSkillvalue =
      highlightedSkill && highlightedSkill.value.replace(/<[^>]+>/g, "");
    return (
      <Text
        onClick={() => highlightedSkillvalue && setQuery(highlightedSkillvalue)}
      >
        <Highlight hit={hit} attribute="jobTitle" />
        <Text fontSize="md" textTransform="capitalize" textColor="gray.500">
          <Highlight hit={hit} attribute="skills" />
        </Text>
      </Text>
    );
  }
  return null;
}

const JobCard = ({ hit }: { hit: Hit }) => {
  // function to  update the search params on click
  const params = `?${new URLSearchParams({ id: hit.objectID })}`;
  const jobLink = useBreakpointValue(
    {
      md: `findjob/${params}`,
      base: `findjob/${hit.objectID}`,
    },
    {
      // Breakpoint to use when mediaqueries cannot be used, such as in server-side rendering
      // (Defaults to 'base')
      fallback: "md",
    }
  );
  const timeago = moment(hit.lastmodified).fromNow();

  return (
    <Link href={jobLink || `/${params}`} className="w-full">
      <Box
        p={8}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        rounded={"md"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
        w="100%"
        mx="auto"
        _hover={{
          cursor: "pointer",
          shadow: "md",
          backgroundColor: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        <Heading as="h1" fontSize={"2xl"}>
          {hit.jobTitle}
        </Heading>
        <Text fontSize="md" textTransform="capitalize" textColor="gray.500">
          {hit.company}
        </Text>
        <Text fontSize="md" textTransform="capitalize" textColor="gray.500">
          {timeago}
        </Text>
        <List spacing={3} mt="3.5">
          {hit.country && (
            <ListItem>
              <ListIcon as={FaMapMarkerAlt} color="green.400" />
              {hit.country} - {hit.city}
            </ListItem>
          )}

          <ListItem>
            <ListIcon as={FaHome} color="green.400" />
            Remote
          </ListItem>
          <ListItem>
            <ListIcon as={FaBriefcase} color="green.400" />
            {hit.jobType}
          </ListItem>
          <ListItem>
            <ListIcon as={FaCode} color="green.400" />
            {hit.jobExperience}
          </ListItem>
        </List>
        <Text pt="2" fontSize="lg" mt="3.5">
          {hit.skills.map((skill) => (
            <Tag
              key={skill}
              size="md"
              variant="solid"
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
  );
};

const JobHits = () => {
  const { results } = useInstantSearch();
  if (!results.nbHits) return null;
  return (
    <VStack spacing="4">
      {results.hits.map((hit) => (
        <JobCard hit={hit} key={hit.objectID} />
      ))}
    </VStack>
  );
};
