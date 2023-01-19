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
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { getCookie } from "cookies-next";
import "instantsearch.css/themes/satellite.css";

import moment from "moment";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
  useSelectedLayoutSegments,
} from "next/navigation";
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
const searchClient: SearchClient = {
  ...algoliaClient,
  search(requests) {
    if (requests.every(({ params }) => !params || !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: "",
          params: "",
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};
type TCurrentView = "mobile" | "desktop";
function Layout({ children }: { children: React.ReactNode }) {
  const layoutSegments = useSelectedLayoutSegments();
  const searchBox_checkbox = useColorModeValue("!bg-gray-200", "!bg-gray-700");
  const labelColor = useColorModeValue(
    "!text-gray-700 flex gap-2",
    "!text-gray-200 flex gap-2"
  );
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
  // redirect mobile user if the user visits the page directly from the desktop view url  to the mobile view url
  const router = useRouter();
  const jobId = useSearchParams().get("id");
  useEffect(() => {
    if (currentView === "mobile" && layoutSegments.length === 0 && jobId) {
      router.replace(`/jobs/${jobId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);
  return (
    <InstantSearch searchClient={searchClient} indexName="job_postings">
      {/* searchbar with auto complete */}
      <SearchBox />
      {/* Filters */}
      {currentView === "desktop" && (
        <Container p={"5"} maxW="container.lg" mx={"auto"} as="div">
          <Flex
            wrap={"wrap"}
            alignItems="center"
            className="gap-2 w-fit mx-auto"
          >
            <FacetDropdown
              buttonText={"Job Type"}
              classNames={{
                button: "w-full md:w-fit",
              }}
            >
              <RefinementList
                classNames={{
                  searchBox: searchBox_checkbox,
                  checkbox: searchBox_checkbox,
                }}
                attribute="jobType"
                searchable={true}
                searchablePlaceholder="Filter by job type"
              />
            </FacetDropdown>
            <FacetDropdown
              buttonText={"Job Experience"}
              classNames={{
                button: "w-full md:w-fit",
              }}
            >
              <RefinementList
                classNames={{
                  searchBox: searchBox_checkbox,
                  checkbox: searchBox_checkbox,
                }}
                attribute="jobExperience"
                searchable={true}
                searchablePlaceholder="Filter by job Experience"
              />
            </FacetDropdown>
            <FacetDropdown
              buttonText={"Location"}
              classNames={{
                button: "w-full md:w-fit",
              }}
            >
              <RefinementList
                classNames={{
                  searchBox: searchBox_checkbox,
                  checkbox: searchBox_checkbox,
                }}
                aria-label="country"
                searchable={true}
                searchablePlaceholder="Filter by country"
                attribute="country"
              />
              <RefinementList
                classNames={{
                  searchBox: searchBox_checkbox,
                  checkbox: searchBox_checkbox,
                }}
                aria-label="city"
                searchable={true}
                searchablePlaceholder="Filter by city"
                attribute="city"
              />
            </FacetDropdown>
            <ToggleRefinement
              classNames={{
                checkbox: searchBox_checkbox,
                label: labelColor,
              }}
              attribute="isRemote"
              label="Remote"
            />
          </Flex>
        </Container>
      )}

      {currentView === "desktop" ? (
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
          {layoutSegments.length === 0 && (
            <>
              <Container p={"5"} maxW="container.lg" mx={"auto"} as="div">
                <Flex
                  wrap={"wrap"}
                  alignItems="center"
                  className="gap-2 w-fit mx-auto"
                >
                  <FacetDropdown
                    buttonText={"Job Type"}
                    classNames={{
                      button: "w-full md:w-fit",
                    }}
                  >
                    <RefinementList
                      classNames={{
                        searchBox: searchBox_checkbox,
                        checkbox: searchBox_checkbox,
                      }}
                      attribute="jobType"
                      searchable={true}
                      searchablePlaceholder="Filter by job type"
                    />
                  </FacetDropdown>
                  <FacetDropdown
                    buttonText={"Job Experience"}
                    classNames={{
                      button: "w-full md:w-fit",
                    }}
                  >
                    <RefinementList
                      classNames={{
                        searchBox: searchBox_checkbox,
                        checkbox: searchBox_checkbox,
                      }}
                      attribute="jobExperience"
                      searchable={true}
                      searchablePlaceholder="Filter by job Experience"
                    />
                  </FacetDropdown>
                  <FacetDropdown
                    buttonText={"Location"}
                    classNames={{
                      button: "w-full md:w-fit",
                    }}
                  >
                    <RefinementList
                      classNames={{
                        searchBox: searchBox_checkbox,
                        checkbox: searchBox_checkbox,
                      }}
                      aria-label="country"
                      searchable={true}
                      searchablePlaceholder="Filter by country"
                      attribute="country"
                    />
                    <RefinementList
                      classNames={{
                        searchBox: searchBox_checkbox,
                        checkbox: searchBox_checkbox,
                      }}
                      aria-label="city"
                      searchable={true}
                      searchablePlaceholder="Filter by city"
                      attribute="city"
                    />
                  </FacetDropdown>
                  <ToggleRefinement
                    classNames={{
                      checkbox: searchBox_checkbox,
                      label: labelColor,
                    }}
                    attribute="isRemote"
                    label="Remote"
                  />
                </Flex>
              </Container>
              <JobHits />
            </>
          )}
          {layoutSegments.length === 1 && children}
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
  const defHits = getCookie("jobtitle")?.toString();

  // runs only once on mount search for job title in cookie and set it as query
  const searchParams = useSearchParams().get("id");
  useEffect(() => {
    if (defHits && !searchParams) {
      refine(defHits);
    }
    if (!defHits && !searchParams) {
      refine(" ");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          className="my-3 ais-Hits p-1"
          ref={ref}
          maxW={"container.md"}
          position={"absolute"}
          width="100%"
          shadow={"2xl"}
          zIndex={999}
          rounded={"xl"}
          overflow="hidden"
        >
          <List className="ais-Hits-list">
            {uniqueHits.map((hit: any) => {
              return (
                <ListItem key={hit.objectID}>
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
  const bg = useColorModeValue("white", "gray.700");
  if (_highlightResult.jobTitle.matchLevel !== "none") {
    return (
      <Text
        className="ais-Hits-item text-start"
        background={bg}
        onClick={() => setQuery(jobTitle)}
      >
        <Highlight hit={hit} attribute="jobTitle" className="text-lg" />
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
      <VStack
        background={bg}
        align={"start"}
        className="ais-Hits-item text-start"
        onClick={() => highlightedSkillvalue && setQuery(highlightedSkillvalue)}
      >
        <Highlight hit={hit} attribute="jobTitle" className="text-lg" />
        <Text fontSize="md" textTransform="capitalize" textColor="gray.500">
          <Highlight hit={hit} attribute="skills" />
        </Text>
      </VStack>
    );
  }
  return null;
}

const JobCard = ({ hit }: { hit: Hit }) => {
  // function to  update the search params on click
  const params = `?${new URLSearchParams({ id: hit.objectID })}`;
  const jobLink = useBreakpointValue(
    {
      md: `jobs/${params}`,
      base: `jobs/${hit.objectID}`,
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
            setIsloading(true);
          }
        });
      });

      observer.observe(sentinelRef.current);
      return () => {
        observer.disconnect();
        setIsloading(false);
      };
    }
  }, [isLastPage, showMore]);
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
  const jobId = useSearchParams().get("id");
  // fetch first job posting on load
  useEffect(() => {
    if (hits.length) {
      const params = `?${new URLSearchParams({ id: hits[0].objectID })}`;
      if (currentView === "desktop" && !jobId) {
        router.push(`/jobs${params}`);
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
      <li
        ref={sentinelRef}
        className="bg-transparent text-transparent"
        aria-hidden="true"
      />
      {loading && <Spinner />}
      {isLastPage && (
        <Text fontSize="md" textColor="gray.500">
          No more jobs to show
        </Text>
      )}
    </VStack>
  );
};
