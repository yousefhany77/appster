import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import React, { useCallback, useRef, useState } from "react";
import { render } from "@react-email/render";
import { useSWRConfig } from "swr";
import { db } from "../../../firebase";
import useUser from "../../../hooks/useUser";
import EmailTemplate from "../../email/emailTemplate";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
function ScheduleInterview({
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
  const [interviewDate, setInterviewDate] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isInvalidDate, setisInvalidDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();
  const handleClick = async () => {
    if (!interviewDate) {
      toast({
        title: "Please select a date",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const docRef = doc(db, "job_postings", jobId, "applications", uid);
      const jobPosting = (await getDoc(doc(db, "job_postings", jobId))).data();
      updateDoc(docRef, {
        status: "Interview Scheduled",
        interviewDate: interviewDate,
      });
      const q = query(
        collection(db, "employees", uid, "applications"),
        where("jobId", "==", jobId)
      );
      const docSnap = await getDocs(q);
      const docId = docSnap.docs[0].id;
      const docRef2 = doc(db, "employees", uid, "applications", docId);
      updateDoc(docRef2, {
        status: "Interview Scheduled",
        interviewDate: interviewDate,
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps

      fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: `Subject: Interview Invitation for ${jobPosting?.jobTitle} role`,
          HTMLmessage: render(
            <EmailTemplate title="The interview has been scheduled">
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Dear {name}
              </p>
              <p>
                I hope this email finds you well. We have reviewed your
                application for the <b>{jobPosting?.jobTitle}</b> role at{" "}
                <b>{jobPosting?.company}</b> and were impressed with your
                qualifications and experience. We would like to invite you to
                participate in an interview as the next step in the selection
                process.
              </p>
              <p>
                The interview has been scheduled for <br />{" "}
                <b>{interviewDate}</b>. the interview will be held online.
                Please let us know if this date and time works for you and if
                not, we will be happy to schedule another date.
                <p>
                  Please come prepared to discuss your qualifications,
                  experience, and how they align with the position. It would
                  also be beneficial to have some questions prepared to ask us
                  about the role and the company. Please let us know if you have
                  any questions or concerns in the meantime. We look forward to
                  meeting you in person.
                </p>
                Best regards,
              </p>
              <br />
              Sincerely,
              <br /> <b>{user?.displayName}</b>
            </EmailTemplate>
          ),
        }),
      });
      onClose();
      toast({
        title: "Interview scheduled ",
        description: "Interview schedule email has been sent to the applicant",
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
    }
    setLoading(false);
  };
  return (
    <>
      <Button
        isLoading={loading}
        ref={btnRef}
        colorScheme="teal"
        variant="outline"
        onClick={onOpen}
      >
        Schedule Interview
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Schedule Interview</DrawerHeader>

          <DrawerBody>
            <Input
              isInvalid={isInvalidDate}
              type="datetime-local"
              onChange={(e) => {
                if (new Date(e.target.value) > new Date()) {
                  setisInvalidDate(false);
                  toast.closeAll();
                  setInterviewDate(new Date(e.target.value).toUTCString());
                } else {
                  setisInvalidDate(true);
                  toast({
                    title: "Please select a valid date",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                  });
                }
              }}
            />
          </DrawerBody>

          <DrawerFooter>
            <Button
              isLoading={loading}
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              isLoading={loading}
              onClick={handleClick}
              colorScheme="teal"
            >
              Schedule Interview
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ScheduleInterview;
