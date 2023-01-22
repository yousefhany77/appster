import { Button, useToast } from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import React from "react";
import { db } from "../../../firebase";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
function Withdraw({ jobId, uid }: { jobId: string; uid: string }) {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  //   delete from company job list
  const q = query(
    collection(db, "job_postings", jobId, "applications"),
    where("userId", "==", uid)
  );
  const e = query(
    collection(db, "employees", uid, "applications"),
    where("jobId", "==", jobId)
  );
  //   delete from employee list
  const withdraw = async () => {
    setLoading(true);
    const companyList = await getDocs(q);
    const employeeList = await getDocs(e);
    employeeList.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    companyList.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    setLoading(false);
    mutate(`dashboard/employee/${uid}`, (data: any) => data, {
      revalidate: true,
    });
    router.refresh();

    toast({
      title: "Withdrawn",
      description: "You have withdrawn from this job posting",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };
  return (
    <Button
      variant={"outline"}
      colorScheme={"red"}
      onClick={withdraw}
      isLoading={loading}
    >
      Withdraw
    </Button>
  );
}

export default Withdraw;
