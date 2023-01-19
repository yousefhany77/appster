import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ApplicantDetails from "../ApplicantDetails";
function ViewDetails({
  uid,
  resumeLink,
  coverLetter,
  employeeName,
  email,
}: {
  uid: string;
  resumeLink: string;
  coverLetter: string;
  employeeName: string;
  email: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="teal" variant="ghost" onClick={onOpen}>
        View Details
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Application Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading as={"h2"} size="md">
              {employeeName}
            </Heading>
            <p className="my-2">{email}</p>
            <Heading size={"lg"} my="4">
              Cover Letter
            </Heading>
            <Text>{coverLetter}</Text>
            <Heading size={"lg"} my="4">
              Resume
            </Heading>
            {resumeLink ? (
              <Link href={resumeLink} isExternal>
                View Resume <ExternalLinkIcon mx="2px" />
              </Link>
            ) : (
              <ApplicantDetails uid={uid} />
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ViewDetails;
