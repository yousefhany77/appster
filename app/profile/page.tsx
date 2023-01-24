"use client";
import { Container, Heading } from "@chakra-ui/react";
import React from "react";
import Profilecareer from "../../components/profile/ProfileCareer";
import ProfileEducation from "../../components/profile/ProfileEducation";
import ProfilePersonalInfo from "../../components/profile/ProfilePersonalInfo";
import useUser from "../../hooks/useUser";

function Profile() {
  const { user } = useUser();
  return (
    <Container p={"8"}>
      <Heading my={"6"} size={"lg"} textAlign="center" className="capitalize">
        {user?.displayName}
      </Heading>
      <Heading my={"6"} size="md">
        Contact
      </Heading>
      <ProfilePersonalInfo />
      <Heading my={"6"} size="md">
        Education
      </Heading>
      <ProfileEducation />
      <Heading my={"6"} size="md">
        career Experience
      </Heading>
      <Profilecareer />
    </Container>
  );
}

export default Profile;
