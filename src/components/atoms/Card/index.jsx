import { Box } from '@chakra-ui/react'

const Card = ({ children, ...rest }) => (
  <Box
    bg="white"
    borderWidth={1}
    borderStyle="solid"
    borderColor="#f2f2f2"
    boxShadow="4px 4px 4px rgba(0, 0, 0, 0.05)"
    borderRadius="xl"
    {...rest}
  >
    {children}
  </Box>
)

export default Card
