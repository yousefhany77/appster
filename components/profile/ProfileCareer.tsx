import { DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { getProfile } from "./ProfilePersonalInfo";
import useSWR from "swr";
import useUser from "../../hooks/useUser";
import { Box, Button, Spinner, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { deleteCareer } from "./Edit";
const Appendcareer = dynamic(
  () => import("./Edit").then((mod) => mod.Appendcareer),
  {
    ssr: false,
    loading: () => <Spinner display={"block"} mx="auto" />,
  }
);
const Updatecareer = dynamic(
  () => import("./Edit").then((mod) => mod.Updatecareer),
  {
    ssr: false,
    loading: () => <Spinner display={"block"} mx="auto" />,
  }
);
function Profilecareer() {
  const [edit, setEdit] = useState(false);
  const [update, setUpdate] = useState(false);
  const { user } = useUser();
  const { data: profile, isLoading } = useSWR(
    `/profile/${user?.uid}`,
    () => user && getProfile(user.uid)
  );
  if (isLoading) return <Spinner display={"block"} mx="auto" />;
  if (!profile) return null;
  return (
    <div className=" relative container border border-slate-500 shadow-md hover:shadow-lg  rounded-lg  w-full flex-col flex justify-center gap-3 p-6   ">
      <VStack spacing={"8"}>
        {!profile?.experience?.length ? (
          <p className="text-center text-gray-500  my-4">
            You have not added any experience yet
          </p>
        ) : null}
        {profile?.experience?.map((ex, index) =>
          !update ? (
            <Box key={index} className="flex w-full flex-col gap-2">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">{ex?.jobTitle}</h1>
                <div className="space-x-4">
                  <EditIcon
                    className="cursor-pointer"
                    boxSize={5}
                    _hover={{ color: "teal.500" }}
                    w={"fit"}
                    color={"teal.400"}
                    onClick={() => setUpdate(true)}
                  />
                  <DeleteIcon
                    className="cursor-pointer"
                    boxSize={5}
                    _hover={{ color: "red.500" }}
                    w={"fit"}
                    color={"red.400"}
                    onClick={() => user && deleteCareer(user.uid, index)}
                  />
                </div>
              </div>
              <p className="text-sm">{ex?.company}</p>
              <p className="text-sm">
                {ex?.time.from} - {ex?.time.to}
              </p>
            </Box>
          ) : (
            <Updatecareer
              setUpdate={setUpdate}
              key={index}
              index={index}
              career={ex}
            />
          )
        )}
      </VStack>
      {edit && !update ? <Appendcareer setEdit={setEdit} /> : null}
      {
        <Button
          disabled={edit || update}
          variant={"outline"}
          colorScheme={"teal"}
          onClick={() => setEdit(true)}
        >
          Add career Experience <PlusSquareIcon mx={"2"} />
        </Button>
      }
    </div>
  );
}

export default Profilecareer;
