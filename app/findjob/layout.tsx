"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  List,
  ListIcon,
  ListItem,
  Spinner,
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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBriefcase, FaCode, FaHome, FaMapMarkerAlt } from "react-icons/fa";
import {
  Highlight,
  InstantSearch,
  RefinementList,
  ToggleRefinement,
  useHits,
  useInfiniteHits,
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
type TCurrentView = "mobile" | "desktop";
function Layout({ children }: { children: React.ReactNode }) {
  const currentView = useBreakpointValue(
    {
      lg: `desktop`,
      base: `mobile`,
    },
    {
      // Breakpoint to use when mediaqueries cannot be used, such as in server-side rendering
      // (Defaults to 'base')
      fallback: "lg",
      ssr: true,
    }
  ) satisfies TCurrentView | undefined;
  return (
    <InstantSearch searchClient={algoliaClient} indexName="job_postings">
      {/* searchbar with auto complete */}
      <SearchBox />
      {/* Filters */}
      <Container p={"5"} mx={"auto"} as="div">
        <Flex wrap={"wrap"} alignItems="center" className="gap-2">
          <FacetDropdown buttonText={"Job Type"}>
            <RefinementList
              classNames={{
                searchBox: useColorModeValue("bg-gray-200", "bg-gray-700"),
                checkbox: useColorModeValue("bg-gray-200 ", "bg-gray-700 "),
              }}
              attribute="jobType"
              searchable={true}
              searchablePlaceholder="Filter by job type"
            />
          </FacetDropdown>
          <FacetDropdown buttonText={"Job Experience"}>
            <RefinementList
              classNames={{
                searchBox: useColorModeValue("bg-gray-200", "bg-gray-700"),
                checkbox: useColorModeValue("bg-gray-200 ", "bg-gray-700 "),
              }}
              attribute="jobExperience"
              searchable={true}
              searchablePlaceholder="Filter by job Experience"
            />
          </FacetDropdown>
          <FacetDropdown buttonText={"Location"}>
            <RefinementList
              classNames={{
                searchBox: useColorModeValue("bg-gray-200", "bg-gray-700"),
                checkbox: useColorModeValue("bg-gray-200 ", "bg-gray-700 "),
              }}
              aria-label="country"
              searchable={true}
              searchablePlaceholder="Filter by country"
              attribute="country"
            />
            <RefinementList
              classNames={{
                searchBox: useColorModeValue("bg-gray-200", "bg-gray-700"),
                checkbox: useColorModeValue("bg-gray-200", "bg-gray-700"),
              }}
              aria-label="city"
              searchable={true}
              searchablePlaceholder="Filter by city"
              attribute="city"
            />
          </FacetDropdown>
          <ToggleRefinement
            classNames={{
              checkbox: useColorModeValue("!bg-gray-200", "!bg-gray-700 "),
              label: useColorModeValue(
                "!text-gray-700 flex gap-2",
                "!text-gray-200 flex gap-2"
              ),
            }}
            attribute="isRemote"
            label="Remote"
          />
        </Flex>
      </Container>

      {currentView !== "mobile" ? (
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
        </Container>
      ) : (
        <Container p="5">
          <JobHits />
        </Container>
      )}
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
  const boxBG = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const value = useDebounce({ value: query, delay: 300 });
  const { hits } = useHits(props);
  useOutsideClick({
    ref: ref,
    handler: () => setIsModalOpen(false),
  });
  useEffect(() => {
    refine(value);
    setIsModalOpen(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
    <Link
      href={jobLink || `/${params}`}
      className="w-full ais-InfiniteHits-list"
    >
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
              <ListIcon as={FaMapMarkerAlt} color="teal.400" />
              {hit.country} - {hit.city}
            </ListItem>
          )}

          <ListItem>
            <ListIcon as={FaHome} color="teal.400" />
            Remote
          </ListItem>
          <ListItem>
            <ListIcon as={FaBriefcase} color="teal.400" />
            {hit.jobType}
          </ListItem>
          <ListItem>
            <ListIcon as={FaCode} color="teal.400" />
            {hit.jobExperience}
          </ListItem>
        </List>
        <Text pt="2" fontSize="lg" mt="3.5">
          {hit.skills.map((skill) => (
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
  );
};

const JobHits = () => {
  const { results } = useInstantSearch();
  const { hits, isLastPage, showMore } = useInfiniteHits();
  const [loading, setIsloading] = useState(false);
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinelRef.current);
      setIsloading(true);
      return () => {
        observer.disconnect();
        setIsloading(false);
      };
    }
  }, [isLastPage, showMore]);
  // fetch first job posting on load
  const currentView = useBreakpointValue(
    {
      lg: `desktop`,
      base: `mobile`,
    },
    {
      // Breakpoint to use when mediaqueries cannot be used, such as in server-side rendering
      // (Defaults to 'base')
      fallback: "lg",
      ssr: true,
    }
  ) satisfies TCurrentView | undefined;
  const router = useRouter();
  useEffect(() => {
    if (hits.length) {
      const params = `?${new URLSearchParams({ id: hits[0].objectID })}`;
      if (currentView === "desktop") {
        router.push(`/findjob${params}`);
      }
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hits]);

  if (!results.nbHits) return null;
  return (
    <VStack spacing="4" className="ais-InfiniteHits">
      {hits.map((hit) => (
        <JobCard hit={hit as unknown as Hit} key={hit.objectID} />
      ))}
      <li ref={sentinelRef} className="bg-transparent" aria-hidden="true" />
      {loading && <Spinner />}
    </VStack>
  );
};