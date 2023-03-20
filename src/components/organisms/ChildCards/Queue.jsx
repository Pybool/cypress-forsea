import { Box, Flex, Text } from '@chakra-ui/react'

const QueueBadge = ({ isPreview, queue, ...rest }) =>
  !isPreview ? (
    <Flex
      as="span"
      alignItems="center"
      borderRadius={8}
      display="inline-flex"
      whiteSpace="nowrap"
      px={7}
      fontSize="2xl"
      fontWeight="extrabold"
      background="grey4"
      color="dark-blue"
      lineHeight="1"
      h={10}
      {...rest}
    >
      <Box as="span" fontSize="md" mx="1ch">
        Lobby
      </Box>{' '}
      {queue.toUpperCase()}
    </Flex>
  ) : (
    <Box
      color="grey2"
      fontSize="2xl"
      fontWeight="bold"
      lineHeight="1"
      pos="absolute"
      right={20}
      top={4}
      width="max-content"
      {...rest}
    >
      Lobby
      <Text as="span" color="grey1">
        {' '}
        {queue.toUpperCase()}
      </Text>
    </Box>
  )

export default QueueBadge
