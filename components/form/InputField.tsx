import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/react";
import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  formik: any;
  isRequired?: boolean;
  as?: any;
}

function InputField(props: InputFieldProps) {
  const { name, label, formik, isRequired } = props;
  return (
    <FormControl
      marginInline={"0"}
      isInvalid={
        !!formik.errors[name.toString()] && formik.touched[name.toString()]
      }
      isRequired={isRequired}
    >
      <FormLabel className="font-bold capitalize">{label}</FormLabel>
      <Input
        type="text"
        // placeholder={label}
        {...props}
        {...formik.getFieldProps(name.toString())}
      />
      <FormErrorMessage>{formik.errors[name.toString()]}</FormErrorMessage>
    </FormControl>
  );
}

export default InputField;
