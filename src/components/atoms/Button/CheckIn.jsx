import { Flex, Box } from '@chakra-ui/react'
import Button from './Base'

const CheckIn = ({ to, icon, color, children, ...rest }) => {
  return (
    <Flex
      boxShadow={'8px 8px 8px rgba(0, 0, 0, 0.1)'}
      bg={color}
      borderRadius={'lg'}
      overflow={'hidden'}
      w={'full'}
      {...rest}
    >
      <Button
        to={to}
        justifyContent={'start'}
        border={'1px solid #E0E0E0'}
        borderLeft={'none'}
        bg={'white'}
        ml={4}
        h={36}
        px={'2.5rem'}
        w={'full'}
        borderLeftRadius={'none'}
        borderRightRadius={'lg'}
        whiteSpace="normal"
      >
        <Flex w="2.6875rem" as="span" justifyContent="center" mr={7}>
          {icon}
        </Flex>
        <Box as="span" mt={1}>
          {children}
        </Box>
      </Button>
    </Flex>
  )
}

export default CheckIn
