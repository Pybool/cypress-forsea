import { Flex } from '@chakra-ui/react'

const Mininav = ({ left, right, ...rest }) => {
  return (
    <Flex
      pos={'absolute'}
      top={0}
      insetInlineStart={0}
      insetInlineEnd={0}
      justifyContent={'space-between'}
      alignItems={'center'}
      px={10}
      py={7}
      {...rest}
    >
      {left}
      {right}
    </Flex>
  )
}

export default Mininav
