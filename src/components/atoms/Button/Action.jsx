import Button from './Base'

const Action = ({ children, ...rest }) => (
  <Button
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="dark-blue"
    _hover={{ bg: 'dark-blue' }}
    color="white"
    borderRadius={8}
    px={6}
    py={4}
    height={24}
    w="100%"
    fontWeight="extrabold"
    fontSize="3xl"
    lineHeight={1}
    {...rest}
  >
    {children}
  </Button>
)

export default Action
