import { StackDivider, VStack } from '@chakra-ui/react'
import Card from '@harmony/atoms/Card'

const Wrapper = ({ header, details, children, ...rest }) => {
  return (
    <VStack
      as={Card}
      divider={<StackDivider borderColor="#e0e0e0" />}
      spacing={3}
      pb={4}
      mb={4}
      {...rest}
    >
      {header}
      {details}
      {children}
    </VStack>
  )
}

export default Wrapper
