import { HStack } from "@chakra-ui/react"
import SelecLocation from "../../SelectMenu"
import InputField from "../InputField"

const PersonalInfo = ({ formik }: {
    formik: any
}) => {

    return (
        <>
            <HStack
                spacing={15}
                justifyContent="start"
                alignItems="start"
                w={"100%"}
            >


                <InputField formik={formik} name={"firstname"} label={"First Name"} placeholder="Youssef" isRequired />
                <InputField formik={formik} name={"lastname"} label={"Last Name"} placeholder="Hany" isRequired />
            </HStack>
            <SelecLocation setValue={formik.setValues} value={formik.values} formikProps={formik} />

            <InputField formik={formik} name={"email"} label={"email"} placeholder={"Your Email"} type="email" isRequired />
            <InputField formik={formik} name={"password"} label={"password"} type="password" placeholder='**********' isRequired />
            <InputField formik={formik} name={"confirmPassword"} label={"Confirm Password"} type="password" placeholder='**********' isRequired />
        </>
    )
}

export default PersonalInfo