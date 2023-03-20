import { Heading } from '@chakra-ui/react'

const Element = ({ children, ...rest }) => {
  return (
    <Heading color="dark-blue" {...rest}>
      {children}
    </Heading>
  )
}

export default Element
