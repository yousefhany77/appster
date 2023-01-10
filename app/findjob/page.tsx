"use client";
import {
  Box,
  Card,
  Skeleton,
  SkeletonText,
  useColorModeValue,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import JobPosting, {
  IJobPosting,
} from "../../components/JobPosting/JobPosting";
import { db } from "../../firebase";
import { useSearchParams } from "next/navigation";

function FindJobsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<IJobPosting | null>(null);
  const bgForm = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getJob(id).then((job) => {
      setJob(job);
      setLoading(false);
    });
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
  if (!job) {
    return <div>job not found</div>;
  }
  return (
    <div>
      <JobPosting className=" overflow-hidden" {...job} />
    </div>
  );
}

export default FindJobsPage;

const getJob = async (id: string) => {
  const docRef = doc(db, "job_postings", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as IJobPosting;
  } else {
    return null;
  }
};
