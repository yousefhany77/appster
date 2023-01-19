"use client";
import { Button, useToast } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import React, { useCallback, useState } from "react";
import { db } from "../../../firebase";
import { render } from "@react-email/render";
import EmailTemplate from "../../../components/email/emailTemplate";
import { useSWRConfig } from "swr";
import useUser from "../../../hooks/useUser";
function Reject({
  uid,
  jobId,
  email,
  name,
}: {
  uid: string;
  jobId: string;
  email: string;
  name: string;
}) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { user } = useUser();
  const toast = useToast();
  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "job_postings", jobId, "applications", uid);
      const jobPosting = (await getDoc(doc(db, "job_postings", jobId))).data();

      updateDoc(docRef, {
        status: "rejected",
      });
      const q = query(
        collection(db, "employees", uid, "applications"),
        where("jobId", "==", jobId)
      );
      const docSnap = await getDocs(q);
      const docId = docSnap.docs[0].id;
      const docRef2 = doc(db, "employees", uid, "applications", docId);
      updateDoc(docRef2, {
        status: "rejected",
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mutate(jobId, (data: any) => {
        const newData = data.map((item: any) => {
          if (item.uid === uid) {
            return { ...item, status: "rejected" };
          }
          return item;
        });
        return newData;
      });
      fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Decision on Job Application",
          HTMLmessage: render(
            <EmailTemplate title="Your application has been rejected">
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Dear {name}
              </p>
              <p>
                Thank you for taking the time to apply for the{" "}
                {jobPosting?.jobTitle} role at {jobPosting?.company}. We
                appreciate your interest in our organization.
              </p>
              <p>
                After a thorough review of your application and an interview
                process, we regret to inform you that we have decided not to
                move forward with your candidacy at this time. We received a
                large number of qualified applicants, and the decision was
                difficult.
              </p>
              <p>
                We want to thank you for your interest in our company and for
                taking the time to apply. We encourage you to keep an eye on our
                career page for future opportunities that may align with your
                skills and experience.
              </p>
              <p>Thank you again for your interest in {jobPosting?.company}.</p>
              <br />
              Sincerely,
              <br /> <b>{user?.displayName}</b>
            </EmailTemplate>
          ),
        }),
      });
      toast({
        title: "Application rejected",
        description: "Rejection email has been sent to the applicant",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Error rejecting the application",
        description: "An error occurred while rejecting the application",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Button variant={"solid"} colorScheme="red" onClick={handleClick}>
      Reject
    </Button>
  );
}

export default Reject;
