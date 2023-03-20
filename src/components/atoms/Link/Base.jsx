import { Link as ChakraLink } from '@chakra-ui/react'

const Link = ({ href, children, ...rest }) => (
  <ChakraLink as="a" href={href} {...rest}>
    {children}
  </ChakraLink>
)

export default Link
