"use client";
import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaLink } from "react-icons/fa";
import ApplicantsTable, {
  IEmployerRow,
} from "../../../../components/table/ApplicantsTable";
import { db } from "../../../../firebase";
import useSWR from "swr";
import { Center, Container, Spinner } from "@chakra-ui/react";
function Page({ params: { jobId } }: { params: { jobId: string } }) {
  const {
    data: applicants,
    isLoading,
    error,
  } = useSWR(
    `/api/jobs/${jobId}/applicants`,
     async () => await  getApplicants(jobId)
  );
  if (isLoading) {
    <Container>
      <h1 className="font-bold text-4xl lg:text-5xl text-center my-8">
        Job Applicants
      </h1>
      <div className="my-6 flex items-center gap-4 justify-end mx-auto max-w-5xl">
        <Link href={`/jobs?id=${jobId}`}>
          Job Post Link <FaLink className="mx-2 inline-block" />
        </Link>
      </div>
      <Center>
        <Spinner display={"block"} margin="auto" />
      </Center>
    </Container>;
  }
  if (error) {
    if (error.message === "Job does not exist") {
      notFound();
    }
  }
  if (!applicants) return null;
  return (
    <section>
      <h1 className="font-bold text-4xl lg:text-5xl text-center my-8">
        Job Applicants
      </h1>
      <div className="my-6 flex items-center gap-4 justify-end mx-auto max-w-5xl">
        <Link href={`/jobs?id=${jobId}`}>
          Job Post Link <FaLink className="mx-2 inline-block" />
        </Link>
      </div>
      <ApplicantsTable
        columns={["name", "date", "status", "details", "interviewDate"]}
        dataRows={applicants}
        jobId={jobId}
      />
    </section>
  );
}

export default Page;

const getApplicants = async (jobId: string): Promise<IEmployerRow[]> => {
  // check if the job exists
  const job = await getDoc(doc(db, "job_postings", jobId));
  if (!job.exists()) {
    throw new Error("Job does not exist");
  }
  const docRef = collection(db, "job_postings", jobId, "applications");
  const applications = await getDocs(docRef);
  return applications.docs.map((doc) => ({
    name: doc.data().name,
    email: doc.data().email,
    status: doc.data().status,
    details: {
      resumeLink: doc.data().resumeLink || "",
      coverLetter: doc.data().coverLetter,
    },
    interviewDate: doc.data().interviewDate,
    date: doc.data().createdAt.toDate().toDateString(),
    uid: doc.data().userId,
  }));
};
