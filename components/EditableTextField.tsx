import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  useEditableControls,
  ButtonGroup,
  IconButton,
  Flex,
  Editable,
  EditablePreview,
  Input,
  EditableInput,
  useColorModeValue,
} from "@chakra-ui/react";
/* Here's a custom control */
function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();
  return isEditing ? (
    <ButtonGroup justifyContent="center" size="md">
      <IconButton
        aria-label="CheckIcon"
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        aria-label="CloseIcon"
        icon={<CloseIcon />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton
        size="md"
        aria-label="EditIcon"
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    </Flex>
  );
}

function EditableTextField({
  name,
  formik,
  defaultValue,
}: {
  name: string;
  formik: any;
  defaultValue: string;
}) {
  const borderColor = useColorModeValue("gray.200", "gray.100");
  return (
    <FormControl
      isRequired
      isInvalid={formik.errors[name] && formik.touched[name]}
    >
      <FormLabel
        fontWeight={"bold"}
        fontSize={"lg"}
        color={useColorModeValue("gray.600", "gray.200")}
        textTransform={"capitalize"}
        mt={"6"}
      >
        {name}
      </FormLabel>
      <Editable
        textAlign="start"
        defaultValue={defaultValue}
        fontSize="xl"
        isPreviewFocusable={false}
        className=" flex justify-start items-center  text-start gap-3"
        onSubmit={(value) => {
          formik.handleChange({ target: { name, value } });
        }}
        {...formik.getFieldProps(name)}
      >
        <EditablePreview
          w={"100%"}
          border="1px solid"
          px={"3"}
          className="flex justify-start items-center  text-start gap-3"
          fontSize={"md"}
          color={useColorModeValue("gray.600", "gray.300")}
          height={"10"}
          borderColor={
            formik.errors[name] && formik.touched[name]
              ? "red.400"
              : borderColor
          }
        />
        {/* Here is the custom input */}
        <Input
          height={"10"}
          as={EditableInput}
          name={name}
          {...formik.getFieldProps(name)}
        />
        <EditableControls />
      </Editable>
      <FormErrorMessage>
        {formik.errors[name] && formik.touched[name] && formik.errors[name]}
      </FormErrorMessage>
    </FormControl>
  );
}
export default EditableTextField;
