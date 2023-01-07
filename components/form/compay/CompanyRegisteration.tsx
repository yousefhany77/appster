import { Center, Container, Heading } from '@chakra-ui/react'
import React from 'react'

function CompanyRegisteration() {
  return (
    <Center p={10}>
      <Container>
        <Heading as={"h1"} size="xl" className="text-primary text-center m-8">
          Sign Up
        </Heading>
      </Container>
    </Center>
  )
}

export default CompanyRegisteration