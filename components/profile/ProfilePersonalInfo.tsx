import { EditIcon } from "@chakra-ui/icons";
import { Button, Container, Spinner, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore/lite";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MdEmail, MdLocationOn } from "react-icons/md";
import useSWR from "swr";
import { db } from "../../firebase";
import useUser from "../../hooks/useUser";
import { IApplicant } from "../table/ApplicantDetails";
const EditPersonalInfo = dynamic(
  () => import("./Edit").then((mod) => mod.EditPersonalInfo),
  { ssr: false }
);
function ProfilePersonalInfo() {
  const [edit, setEdit] = useState(false);
  const { user } = useUser();
  const { data: profile, isLoading } = useSWR(
    `/profile/${user?.uid}`,
    () => user && getProfile(user.uid)
  );
  if (isLoading) return <Spinner display={"block"} mx="auto" />;
  if (!profile) return null;
  if (edit) return <EditPersonalInfo setEdit={setEdit} />;
  return (
    <div className=" relative container border border-slate-500 shadow-md hover:shadow-lg  rounded-lg  w-full flex-col flex justify-center gap-3 p-6   ">
      <Text size={"lg"}>
        <MdEmail className="inline-block" /> {profile?.email}
      </Text>
      <Text size={"lg"}>
        <MdLocationOn className="inline-block" /> {profile?.country} ,
        {profile?.city}
      </Text>

      <EditIcon
        className="cursor-pointer"
        boxSize={5}
        position={"absolute"}
        top={"3"}
        right={"3"}
        _hover={{ color: "teal.500" }}
        w={"fit"}
        mx={"auto"}
        color={"teal.400"}
        onClick={() => setEdit(true)}
      />
    </div>
  );
}

export default ProfilePersonalInfo;

export const getProfile = async (uid: string) => {
  const docRef = doc(db, "employees", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as IApplicant;
  }
  return null;
};
