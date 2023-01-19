"use client";
import { Container, VStack } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore/lite";
import { useMemo } from "react";
import useSWR from "swr";
import ApplicantsTable, {
  IEmployerRow,
} from "../../components/table/ApplicantsTable";
import JobApplicationsTable, {
  IEmployeeRow,
} from "../../components/table/JobApplicationsTable";
import { db } from "../../firebase";

const getApplicants = async (jobId: string): Promise<IEmployerRow[]> => {
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

const getApplications = async (userId: string): Promise<IEmployeeRow[]> => {
  const docRef = collection(db, "employees", userId, "applications");
  const applications = await getDocs(docRef);
  return applications.docs.map((doc) => ({
    company: doc.data().company,
    status: doc.data().status,
    details: {
      resumeLink: doc.data().resumeLink || "",
      coverLetter: doc.data().coverLetter,
      employeeName: doc.data().name,
      email: doc.data().email,
    },
    interviewDate: doc.data().interviewDate,
    jobPosting: doc.data().jobId,
    jobTitle: doc.data().jobTitle,
  }));
};
// i7iyiYIFq6xtAzgSYwXE

function Page() {
  const { data, isLoading } = useSWR("yMC0UIZrUV4Jc0BcUYZe", getApplicants);
  const { data: applications, isLoading: applicationsLoading } = useSWR(
    "o75NsUnRkuVv0MIdnKe0iNiiiI73",
    getApplications
  );
  if (isLoading || applicationsLoading) return <div>loading</div>;
  if (!data || !applications)
    return (
      <Container maxW="container.xl">
        <div>no data</div>
      </Container>
    );
  return (
    <VStack spacing={"16"}>
      <ApplicantsTable
        jobId="yMC0UIZrUV4Jc0BcUYZe"
        columns={["name", "date", "status", "details", "interviewDate"]}
        dataRows={data}
      />
      <JobApplicationsTable
        columns={[
          "jobTitle",
          "company",
          "jobPosting",
          "status",
          "details",
          "interviewDate",
        ]}
        dataRows={applications}
      />
    </VStack>
  );
}

export default Page;
