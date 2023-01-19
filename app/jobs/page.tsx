"use client";
import {
  Box,
  Skeleton,
  SkeletonText,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore/lite";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInstantSearch, useSearchBox } from "react-instantsearch-hooks-web";
import JobApplication from "../../components/JobApplication";
import JobPosting, {
  IJobPosting,
} from "../../components/JobPosting/JobPosting";
import { db } from "../../firebase";

function FindJobsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<IJobPosting | null>(null);
  const bgForm = useColorModeValue("gray.50", "gray.700");
  const { refine } = useSearchBox();
  const { results } = useInstantSearch();
  const toast = useToast();
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getJob(id)
      .then((job) => {
        setJob(job);
        if (!results.nbHits) {
          refine(job?.skills.slice(0, 2).join(" ") || "");
        }
        setLoading(false);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: "Job not found",
          status: "error",
          isClosable: true,
          duration: 3000,
          position: "top",
          onCloseComplete() {
            window.location.href = "/jobs";
          },
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (loading) {
    return (
      <Box bg={bgForm} p={6} className=" w-full  rounded-xl">
        <Skeleton height="15px" rounded={"md"} my={3} width={"56"} />
        <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="2" />
        <Skeleton height="15px" rounded={"md"} my={3} width={"24"} />
        <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        <Skeleton height="15px" rounded={"md"} my={3} width={"44"} />
        <SkeletonText mt="4" noOfLines={16} spacing="4" skeletonHeight="2" />
      </Box>
    );
  }
  if (!job) return null;
  if (!id) return null;
  return <JobPosting className=" overflow-hidden" {...job} jobId={id} />;
}

export default FindJobsPage;

const getJob = async (id: string) => {
  const docRef = doc(db, "job_postings", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as IJobPosting;
  } else {
    throw new Error("Job not found");
  }
};
