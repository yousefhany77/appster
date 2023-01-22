"use client";

import { Container, Heading, Spinner } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore/lite";
import JobApplicationsTable, {
  IEmployeeRow,
} from "../../components/table/JobApplicationsTable";
import { db } from "../../firebase";
import useUser from "../../hooks/useUser";
import useSWR from "swr";
function EmployeeDashboard() {
  const { user } = useUser();
  const { data: applications, isLoading: applicationsLoading } = useSWR(
    `dashboard/employee/${user?.uid}`,
    async () => user && await getApplications(user.uid)
  );
  if (applicationsLoading || !user)
    return (
      <Container>
        <Heading my={"8"} textAlign="center">
          Job Applications
        </Heading>
        <Spinner mx={"auto"} display="block" />
      </Container>
    );
  if (!applications) return <div>no data</div>;
  return (
    <>
      <Heading my={"8"} textAlign="center">
        Job Applications
      </Heading>
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
    </>
  );
}

export default EmployeeDashboard;

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
