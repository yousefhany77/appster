import { doc, getDoc } from "firebase/firestore/lite";
import React from "react";
import JobApplication from "../../../components/JobApplication";
import JobPosting, {
  IJobPosting,
} from "../../../components/JobPosting/JobPosting";
import { db } from "../../../firebase";

async function page({ params: { id } }: { params: { id: string } }) {
  try {
    const job = await getJob(id);
    return (
      <div className="space-y-2 container ">
        <JobPosting
          className=" !shadow-none "
          jobDescription={job.jobDescription}
          jobTitle={job.jobTitle}
          jobType={job.jobType}
          skills={job.skills}
          jobExperience={job.jobExperience}
          maxJobSalary={job.maxJobSalary}
          minJobSalary={job.minJobSalary}
          city={job.city}
          company={job.company}
          country={job.country}
          isRemote={job.isRemote}
        />
        <JobApplication jobId={id} />
      </div>
    );
  } catch (error) {
    return <div>Job not found</div>;
  }
}

export default page;

const getJob = async (id: string) => {
  const docRef = doc(db, "job_postings", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as IJobPosting;
  } else {
    throw new Error("Job not found");
  }
};
