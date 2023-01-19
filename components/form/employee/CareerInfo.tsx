import {
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import InputField from "../InputField";

const CareerInfo = ({ formik }: { formik: any }) => {
  const [isWorking, setIsWorking] = useState(
    formik.values.workedTo === "Present"
  );
  const [skills, setSkills] = useState<string[]>(formik.values.skills);
  const skillsRef = useRef<HTMLInputElement>(null);
  const addSkill = (skill: string) => {
    if (!skill) return;
    const skillsSet = new Set(skills);
    if (skillsSet.has(skill)) {
      return;
    }
    setSkills([...skills, skill]);
    formik.setValues({
      ...formik.values,
      skills: [...skills, skill],
    });
    if (skillsRef.current && skillsRef.current.value) {
      skillsRef.current.value = "";
    }
  };
  const removeSkill = (skill: string) => {
    const skillsSet = new Set(skills);
    if (!skillsSet.has(skill)) {
      return;
    }
    skillsSet.delete(skill);
    setSkills(Array.from(skillsSet));
    formik.setValues({
      ...formik.values,
      skills: Array.from(skillsSet),
    });
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      addSkill(e.target.value);
    }
  };

  return (
    <>
      <InputField
        formik={formik}
        label={"Job Title"}
        name="jobTitle"
        placeholder="Frontend Developer"
        isRequired
      />
      <InputField
        formik={formik}
        label={"Company"}
        name="company"
        placeholder="Amazon"
        isRequired
      />
      <Textarea
        placeholder="About your Work Experience There"
        name="about"
        {...formik.getFieldProps("about")}
      />

      <HStack spacing={15} justifyContent="start" alignItems="start">
        <InputField
          formik={formik}
          name={"workedFrom"}
          label={"From"}
          placeholder="From"
          type="date"
          isRequired
          {...formik.getFieldProps("workedFrom")}
        />
        <InputField
          formik={formik}
          name={"workedTo"}
          label={"To"}
          placeholder="To"
          type="date"
          
          isRequired
          disabled={isWorking}
          {...formik.getFieldProps("workedTo")}
        />
        <Checkbox
          colorScheme={"teal"}
          {...formik.getFieldProps("isStillWorking")}
          onChange={(e) => {
            setIsWorking(e.target.checked);
            formik.setValues({
              ...formik.values,
              workedTo: e.target.checked ? "Present" : "",
            });
          }}
        >
          Present
        </Checkbox>
      </HStack>
      <VStack width={"full"}>
        <Text fontWeight={"bold"} alignSelf={"start"}>
          Skills
        </Text>
        <Flex flexWrap={"wrap"}>
          {skills?.map((skill) => (
            <>
              <Tag
                size={"lg"}
                key={skill}
                borderRadius="full"
                variant="solid"
                m={1}
              >
                <TagLabel>{skill}</TagLabel>
                <TagCloseButton onClick={() => removeSkill(skill)} />
              </Tag>
              <Spacer />
            </>
          ))}
        </Flex>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            placeholder="Add your skills"
            ref={skillsRef}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => addSkill(skillsRef.current?.value || "")}
            >
              Add
            </Button>
          </InputRightElement>
        </InputGroup>
      </VStack>
    </>
  );
};

export default CareerInfo;
