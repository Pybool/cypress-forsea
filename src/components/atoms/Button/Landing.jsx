import { Box } from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'
import Base from './Base'

const Landing = ({ to, icon, onClick, children, ...rest }) => (
  <Base
    bg="white"
    borderRadius="3xl"
    boxShadow="8px 8px 8px rgba(0, 0, 0, 0.1);"
    color="dark-blue"
    flexDirection="column"
    fontFamily="heading"
    gap={4}
    h={64}
    to={to}
    justifyContent="center"
    onClick={onClick}
    overflow="hidden"
    px="2.5rem"
    w="full"
    fontSize="4xl"
    fontWeight="extrabold"
    {...rest}
  >
    {icon && <Icon name={icon} height="12" />}
    <Box as="span">{children}</Box>
  </Base>
)

export default Landing
