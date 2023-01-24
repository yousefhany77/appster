import { CheckIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Button, Checkbox, Heading, HStack, useToast } from "@chakra-ui/react";
import { verifyBeforeUpdateEmail } from "firebase/auth";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { useFormik } from "formik";
import { useState } from "react";
import { useSWRConfig } from "swr";
import * as Yup from "yup";
import { db } from "../../firebase";
import useUser from "../../hooks/useUser";
import logout from "../../util/logout";
import InputField from "../form/InputField";
import SelecLocation from "../SelectMenu";
import { mutate } from "swr";
const EditPersonalInfo = ({
  setEdit,
}: {
  setEdit: (edit: boolean) => void;
}) => {
  const { user } = useUser();
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const formik = useFormik({
    initialValues: {
      email: "",
      country: "",
      city: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      country: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      if (!user) return;
      try {
        const docRef = doc(db, "employees", user.uid);
        await updateDoc(docRef, values);
        if (user?.email !== values.email) {
          await verifyBeforeUpdateEmail(user, values.email);
        }
        mutate(`/profile/${user?.uid}`);
        toast({
          title: "Varification email sent to your email",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
          toast({
            title: "Please login again to update your email",
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
          return logout();
        }
        toast({
          title: "Error updating profile",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setEdit(false);
      }
    },
  });
  return (
    <div className="container  border-slate-500 border shadow-md hover:shadow-lg  rounded-lg p-6 w-full flex flex-col items-center gap-3 ">
      <InputField formik={formik} name={"email"} label={"Email"} isRequired />

      <SelecLocation
        setValue={formik.setValues}
        value={formik.values}
        formikProps={formik}
      />
      <Button
        onClick={formik.submitForm}
        isLoading={formik.isSubmitting}
        colorScheme="teal"
        w={"full"}
      >
        Save Changes <CheckIcon mx={"2"} />
      </Button>
      <Button
        onClick={() => setEdit(false)}
        isLoading={formik.isSubmitting}
        colorScheme="red"
        w={"full"}
      >
        Discard changes
      </Button>
    </div>
  );
};

const appendEducation = async (
  uid: string,
  edu: {
    degree: string;
    field: string;
    university: string;
    from: string;
    to: string;
  }
) => {
  const docRef = doc(db, "employees", uid);
  await updateDoc(docRef, {
    education: arrayUnion(edu),
  });
};

const deleteEducation = async (uid: string, index: number) => {
  const docRef = doc(db, "employees", uid);
  const docSnap = await getDoc(docRef);
  const education = docSnap.data()?.education;
  education.splice(index, 1);
  await updateDoc(docRef, {
    education,
  });
  mutate(`/profile/${uid}`);
};

const updateEducation = async (
  uid: string,
  index: number,
  edu: {
    degree: string;
    field: string;
    university: string;
    from: string;
    to: string;
  }
) => {
  const docRef = doc(db, "employees", uid);
  const docSnap = await getDoc(docRef);
  const education = docSnap.data()?.education;
  education[index] = edu;
  await updateDoc(docRef, {
    education,
  });
};

function AppendEducation({ setEdit }: { setEdit: (edit: boolean) => void }) {
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const toast = useToast();
  const [isStudying, setIsStudying] = useState(false);
  const formik = useFormik({
    initialValues: {
      university: "",
      degree: "",
      isStillStudying: false,
      field: "",
      from: "",
      to: "",
    },
    validationSchema: Yup.object({
      university: Yup.string().required("Required"),
      degree: Yup.string().required("Required"),
      field: Yup.string().required("Required"),
      from: Yup.date()
        .max(new Date(), "Cannot use future date")
        .required("Required"),
      isStillStudying: Yup.boolean(),
      to: Yup.date()
        .transform((_, originalValue) => {
          const newValue = new Date().toDateString().replace(/\//g, "-");
          return originalValue === "Present" ? newValue : originalValue;
        })
        .when("isStillStudying", {
          is: false,
          then: Yup.date()
            .min(Yup.ref("from"), "To date must be greater than from date")
            .required("Required"),
        }),
    }),
    onSubmit: async (values) => {
      if (!user) return;
      try {
        await appendEducation(user.uid, values);
        mutate(`/profile/${user?.uid}`);
        toast({
          title: "Education added",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } catch (error: any) {
        toast({
          title: "Error adding education",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } finally {
        formik.resetForm();
        setEdit(false);
      }
    },
  });
  return (
    <div className="container  border-slate-500 border shadow-md hover:shadow-lg  rounded-lg p-6 w-full flex flex-col items-center gap-3 ">
      <Heading size={"md"} color="brand.primary">
        Add Education <PlusSquareIcon mx={"2"} />
      </Heading>
      <InputField
        formik={formik}
        name={"university"}
        label={"University"}
        placeholder="Your School"
        isRequired
      />
      <InputField
        formik={formik}
        name={"degree"}
        label={"Degree"}
        placeholder="Your Degree"
        isRequired
      />
      <InputField
        formik={formik}
        name={"field"}
        label={"Field"}
        placeholder="Your Field"
        isRequired
      />
      <HStack
        w={"full"}
        spacing={15}
        justifyContent="start"
        alignItems="start"
        position={"relative"}
        className="flex-wrap lg:flex-nowrap"
        gap={4}
      >
        <InputField
          formik={formik}
          name={"from"}
          label={"From"}
          placeholder="From"
          type="date"
          isRequired
        />
        <InputField
          formik={formik}
          name={"to"}
          label={"To"}
          placeholder="To"
          type="date"
          className=""
          isRequired
          disabled={isStudying}
        />
        <Checkbox
          position={"absolute"}
          top={"0"}
          right={"0"}
          colorScheme={"teal"}
          {...formik.getFieldProps("isStillStudying")}
          onChange={(e) => {
            setIsStudying(e.target.checked);
            formik.setValues({
              ...formik.values,

              to: e.target.checked ? "Present" : "",
            });
          }}
        >
          Present
        </Checkbox>
      </HStack>
      <Button
        onClick={formik.submitForm}
        isLoading={formik.isSubmitting}
        colorScheme="teal"
        w={"full"}
      >
        Save Changes <CheckIcon mx={"2"} />
      </Button>
      <Button
        onClick={() => setEdit(false)}
        isLoading={formik.isSubmitting}
        colorScheme="red"
        w={"full"}
      >
        Discard changes
      </Button>
    </div>
  );
}
function UpdateEducation({
  setUpdate,
  index,
  edu,
}: {
  setUpdate: (edit: boolean) => void;
  index: number;
  edu: {
    degree: string;
    field: string;
    university: string;
    from: string;
    to: string;
  };
}) {
  const { user } = useUser();
  const toast = useToast();
  const [isStudying, setIsStudying] = useState(false);
  const { mutate } = useSWRConfig();
  const formik = useFormik({
    initialValues: {
      university: edu.university,
      degree: edu.degree,
      isStillStudying: false,
      field: edu.field,
      from: edu.from,
      to: edu.to,
    },
    validationSchema: Yup.object({
      university: Yup.string().required("Required"),
      degree: Yup.string().required("Required"),
      field: Yup.string().required("Required"),
      from: Yup.date()
        .max(new Date(), "Cannot use future date")
        .required("Required"),
      isStillStudying: Yup.boolean(),
      to: Yup.date()
        .transform((_, originalValue) => {
          const newValue = new Date().toDateString().replace(/\//g, "-");
          return originalValue === "Present"
            ? newValue
            : new Date(originalValue);
        })
        .when("isStillStudying", {
          is: false,
          then: Yup.date()
            .min(Yup.ref("from"), "To date must be greater than from date")
            .required("Required"),
        }),
    }),
    onSubmit: async (values) => {
      if (!user) return;
      try {
        await updateEducation(user.uid, index, values);
        mutate(`/profile/${user?.uid}`);
        toast({
          title: "Education Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } catch (error: any) {
        toast({
          title: "Error adding education",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } finally {
        formik.resetForm();
        setUpdate(false);
      }
    },
  });
  return (
    <div className="container  border-slate-500 border shadow-md hover:shadow-lg  rounded-lg p-6 w-full flex flex-col items-center gap-3 ">
      <Heading size={"md"} color="brand.primary">
        Update Education <PlusSquareIcon mx={"2"} />
      </Heading>
      <InputField
        formik={formik}
        name={"university"}
        label={"University"}
        placeholder="Your School"
        isRequired
      />
      <InputField
        formik={formik}
        name={"degree"}
        label={"Degree"}
        placeholder="Your Degree"
        isRequired
      />
      <InputField
        formik={formik}
        name={"field"}
        label={"Field"}
        placeholder="Your Field"
        isRequired
      />
      <HStack
        w={"full"}
        spacing={15}
        justifyContent="start"
        alignItems="start"
        position={"relative"}
        className="flex-wrap lg:flex-nowrap"
        gap={4}
      >
        <InputField
          formik={formik}
          name={"from"}
          label={"From"}
          placeholder="From"
          type="date"
          isRequired
        />
        <InputField
          formik={formik}
          name={"to"}
          label={"To"}
          placeholder="To"
          type="date"
          isRequired
          disabled={isStudying}
        />
        <Checkbox
          position={"absolute"}
          top={"0"}
          right={"0"}
          colorScheme={"teal"}
          {...formik.getFieldProps("isStillStudying")}
          onChange={(e) => {
            setIsStudying(e.target.checked);
            formik.setValues({
              ...formik.values,

              to: e.target.checked ? "Present" : "",
            });
          }}
        >
          Present
        </Checkbox>
      </HStack>
      <Button
        onClick={formik.submitForm}
        isLoading={formik.isSubmitting}
        colorScheme="teal"
        w={"full"}
      >
        Save Changes <CheckIcon mx={"2"} />
      </Button>
      <Button
        onClick={() => setUpdate(false)}
        isLoading={formik.isSubmitting}
        colorScheme="red"
        w={"full"}
      >
        Discard changes
      </Button>
    </div>
  );
}

const addCareer = async (
  uid: string,
  career: {
    company: string;
    jobTitle: string;
    time: {
      from: string;
      to: string;
    };
  }
) => {
  const docRef = doc(db, "employees", uid);
  await updateDoc(docRef, {
    experience: arrayUnion(career),
  });
};
const updateCareer = async (
  uid: string,

  career: {
    company: string;
    jobTitle: string;
    time: {
      from: string;
      to: string;
    };
  },
  index: number
) => {
  const docRef = doc(db, "employees", uid);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) return;
  const experience = data.experience;
  experience[index] = career;
  await updateDoc(docRef, {
    experience,
  });
};
const deleteCareer = async (uid: string, index: number) => {
  const docRef = doc(db, "employees", uid);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) return;
  const experience = data.experience;
  experience.splice(index, 1);
  await updateDoc(docRef, {
    experience,
  });
  mutate(`/profile/${uid}`);
};
function Appendcareer({ setEdit }: { setEdit: (edit: boolean) => void }) {
  const { user } = useUser();
  const toast = useToast();
  const [isWorking, setIsWorking] = useState(false);
  const { mutate } = useSWRConfig();
  const formik = useFormik({
    initialValues: {
      isStillWorking: false,
      company: "",
      jobTitle: "",
      from: "",
      to: "",
    },
    validationSchema: Yup.object({
      company: Yup.string().required("Required"),
      jobTitle: Yup.string().required("Required"),
      from: Yup.date()
        .max(new Date(), "Cannot use future date")
        .required("Required"),
      isStillWorking: Yup.boolean(),
      to: Yup.date()
        .transform((_, originalValue) => {
          const newValue = new Date().toDateString().replace(/\//g, "-");
          return originalValue === "Present"
            ? newValue
            : new Date(originalValue);
        })
        .when("isStillWorking", {
          is: false,
          then: Yup.date()
            .min(Yup.ref("from"), "To date must be greater than from date")
            .required("Required"),
        }),
    }),
    onSubmit: async (values) => {
      if (!user) return;
      try {
        await addCareer(user.uid, {
          company: values.company,
          jobTitle: values.jobTitle,
          time: {
            from: values.from,
            to: values.to,
          },
        });
        mutate(`/profile/${user?.uid}`);
        toast({
          title: "Career Added",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } catch (error: any) {
        toast({
          title: "Error adding career",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } finally {
        formik.resetForm();
        setEdit(false);
      }
    },
  });
  return (
    <div className="container  border-slate-500 border shadow-md hover:shadow-lg  rounded-lg p-6 w-full flex flex-col items-center gap-3 ">
      <Heading size={"md"} color="brand.primary">
        Add Career <PlusSquareIcon mx={"2"} />
      </Heading>
      <InputField
        formik={formik}
        name={"company"}
        label={"Company"}
        placeholder="Your Company"
        isRequired
      />
      <InputField
        formik={formik}
        name={"jobTitle"}
        label={"Position"}
        placeholder="Your Position"
        isRequired
      />
      <HStack
        w={"full"}
        spacing={15}
        justifyContent="start"
        alignItems="start"
        position={"relative"}
        className="flex-wrap lg:flex-nowrap"
        gap={4}
      >
        <InputField
          formik={formik}
          name={"from"}
          label={"From"}
          placeholder="From"
          type="date"
          isRequired
        />
        <InputField
          formik={formik}
          name={"to"}
          label={"To"}
          placeholder="To"
          type="date"
          isRequired
          disabled={formik.values.isStillWorking || isWorking}
        />
        <Checkbox
          position={"absolute"}
          top={"0"}
          right={"0"}
          colorScheme={"teal"}
          {...formik.getFieldProps("isStillWorking")}
          onChange={(e) => {
            setIsWorking(e.target.checked);
            formik.setValues({
              ...formik.values,
              to: e.target.checked ? "Present" : "",
            });
          }}
        >
          Present
        </Checkbox>
      </HStack>
      <Button
        onClick={formik.submitForm}
        isLoading={formik.isSubmitting}
        colorScheme="teal"
        w={"full"}
      >
        Save Changes <CheckIcon mx={"2"} />
      </Button>
      <Button
        onClick={() => setEdit(false)}
        isLoading={formik.isSubmitting}
        colorScheme="red"
        w={"full"}
      >
        Discard changes
      </Button>
    </div>
  );
}
function Updatecareer({
  setUpdate,
  career,
  index,
}: {
  setUpdate: (edit: boolean) => void;
  career: {
    company: string;
    jobTitle: string;
    time: {
      from: string;
      to: string;
    };
  };
  index: number;
}) {
  const { user } = useUser();
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const formik = useFormik({
    initialValues: {
      isStillWorking: career.time.to === "Present",
      company: career.company,
      jobTitle: career.jobTitle,
      from: career.time.from,
      to: career.time.to,
    },
    validationSchema: Yup.object({
      company: Yup.string().required("Required"),
      position: Yup.string().required("Required"),
      from: Yup.date()
        .max(new Date(), "Cannot use future date")
        .required("Required"),
      isStillWorking: Yup.boolean(),
      to: Yup.date()
        .transform((_, originalValue) => {
          const newValue = new Date().toDateString().replace(/\//g, "-");
          return originalValue === "Present"
            ? newValue
            : new Date(originalValue);
        })
        .when("isStillWorking", {
          is: false,
          then: Yup.date()
            .min(Yup.ref("from"), "To date must be greater than from date")
            .required("Required"),
        }),
    }),
    onSubmit: async (values) => {
      if (!user) return;
      try {
        await updateCareer(
          user.uid,
          {
            company: values.company,
            jobTitle: values.jobTitle,
            time: {
              from: values.from,
              to: values.to,
            },
          },
          index
        );
        mutate(`/profile/${user?.uid}`);
        toast({
          title: "Career Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } catch (error: any) {
        toast({
          title: "Error updating career",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } finally {
        formik.resetForm();
        setUpdate(false);
      }
    },
  });
  return (
    <div className="container  border-slate-500 border shadow-md hover:shadow-lg  rounded-lg p-6 w-full flex flex-col items-center gap-3 ">
      <Heading size={"md"} color="brand.primary">
        Update Career <PlusSquareIcon mx={"2"} />
      </Heading>
      <InputField
        formik={formik}
        name={"company"}
        label={"Company"}
        placeholder="Your Company"
        isRequired
      />
      <InputField
        formik={formik}
        name={"jobTitle"}
        label={"Position"}
        placeholder="Your Position"
        isRequired
      />
      <HStack
        w={"full"}
        spacing={15}
        justifyContent="start"
        alignItems="start"
        position={"relative"}
        className="flex-wrap lg:flex-nowrap"
        gap={4}
      >
        <InputField
          formik={formik}
          name={"from"}
          label={"From"}
          placeholder="From"
          type="date"
          isRequired
        />
        <InputField
          formik={formik}
          name={"to"}
          label={"To"}
          placeholder="To"
          type="date"
          isRequired
          disabled={formik.values.isStillWorking}
        />
        <Checkbox
          position={"absolute"}
          top={"0"}
          right={"0"}
          colorScheme={"teal"}
          {...formik.getFieldProps("isStillWorking")}
          onChange={(e) => {
            formik.setValues({
              ...formik.values,
              to: e.target.checked ? "Present" : "",
            });
          }}
        >
          Present
        </Checkbox>
      </HStack>
      <Button
        onClick={formik.submitForm}
        isLoading={formik.isSubmitting}
        colorScheme="teal"
        w={"full"}
      >
        Save Changes <CheckIcon mx={"2"} />
      </Button>
      <Button
        onClick={() => setUpdate(false)}
        isLoading={formik.isSubmitting}
        colorScheme="red"
        w={"full"}
      >
        Discard changes
      </Button>
    </div>
  );
}
export {
  EditPersonalInfo,
  AppendEducation,
  UpdateEducation,
  deleteEducation,
  Appendcareer,
  Updatecareer,
  deleteCareer,
};
