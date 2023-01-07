import { Checkbox, HStack } from "@chakra-ui/react"
import { useState } from "react"
import InputField from "../InputField"

const EducationInfo = ({ formik }: {
    formik: any
}) => {
    const [isStudying, setIsStudying] = useState(formik.values.to === "Present")
    return (
        <>
            <InputField formik={formik} name={"university"} label={"University"} placeholder="Your School" isRequired />
            <InputField formik={formik} name={"degree"} label={"Degree"} placeholder="Your Degree" isRequired />
            <InputField formik={formik} name={"field"} label={"Field"} placeholder="Your Field" isRequired />
            <HStack
                spacing={15}
                justifyContent="start"
                alignItems="start"
            >
                <InputField formik={formik} name={"from"} label={"From"} placeholder="From" type="date" isRequired />
                <InputField formik={formik} name={"to"} label={"To"} placeholder="To" type="date" isRequired disabled={isStudying} />
                <Checkbox
                    colorScheme={"red"}

                    isChecked={isStudying}
                    onChange={(e) => {
                        setIsStudying(e.target.checked)
                        formik.setValues({
                            ...formik.values,

                            to: e.target.checked ? "Present" : ""

                        })
                    }}
                >
                    Present
                </Checkbox>
            </HStack>
        </>
    )
}

export default EducationInfo