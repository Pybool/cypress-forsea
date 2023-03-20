import { Box, Flex, Text } from '@chakra-ui/react'

const CountBadge = ({ isPreview, index, total, ...rest }) =>
  !isPreview ? (
    <Flex
      as="span"
      alignItems="center"
      borderRadius={8}
      display="inline-flex"
      whiteSpace="nowrap"
      px={7}
      textTransform="lowercase"
      fontSize="2xl"
      fontWeight="extrabold"
      background="grey4"
      color="dark-blue"
      lineHeight="1"
      h={10}
      {...rest}
    >
      {index}{' '}
      <Box as="span" fontSize="md" mx="1ch">
        of
      </Box>{' '}
      {total}
    </Flex>
  ) : (
    <Box
      color="grey2"
      fontSize="2xl"
      fontWeight="bold"
      lineHeight="1"
      pos="absolute"
      right={3}
      top={4}
      width="max-content"
      {...rest}
    >
      <Text as="span" color="grey1">
        {index}{' '}
      </Text>
      of
      <Text as="span" color="grey1">
        {' '}
        {total}
      </Text>
    </Box>
  )

export default CountBadge
