"use client";
import { Button, useToast } from "@chakra-ui/react";
import { render } from "@react-email/render";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { mutate } from "swr";
import EmailTemplate from "../../../components/email/emailTemplate";
import { db } from "../../../firebase";
import useUser from "../../../hooks/useUser";
function Accept({
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
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "job_postings", jobId, "applications", uid);
      const jobPosting = (await getDoc(doc(db, "job_postings", jobId))).data();
      updateDoc(docRef, {
        status: "accepted",
      });
      const q = query(
        collection(db, "employees", uid, "applications"),
        where("jobId", "==", jobId)
      );
      const docSnap = await getDocs(q);
      const docId = docSnap.docs[0].id;
      const docRef2 = doc(db, "employees", uid, "applications", docId);
      updateDoc(docRef2, {
        status: "accepted",
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps

      fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Subject: Offer of Employment",
          HTMLmessage: render(
            <EmailTemplate title="Your application has been Accepted">
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Dear {name},
              </p>
              <p>
                I am pleased to inform you that we would like to extend an offer
                of employment to you for the {jobPosting?.jobTitle} role at{" "}
                {jobPosting?.company} . We were impressed by your qualifications
                and experience and believe that you would be a valuable asset to
                our team.
              </p>
              <p>
                Please let us know if you accept our offer by
                {`  ${new Date(
                  Date.now() +
                    1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10
                ).toLocaleDateString()} 12:00 AM   `}
                . If you accept, we will send you the necessary paperwork and
                schedule a start date. We are excited to welcome you to the team
                and look forward to working with you.{" "}
                <p>Please let me know if you have any questions or concerns.</p>
                Best regards,
              </p>
              <br />
              Sincerely,
              <br /> <b>{user?.displayName}</b>
            </EmailTemplate>
          ),
        }),
      });
      router.refresh();

      toast({
        title: "Application Accepted",
        description: "Acceptance email has been sent to the applicant",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error rejecting the application",
        description: "An error occurred while rejecting the application",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Button
      isLoading={loading}
      variant={"solid"}
      colorScheme="teal"
      onClick={handleClick}
    >
      Accept
    </Button>
  );
}

export default Accept;
