import React from 'react'

import { Box, Text } from '@chakra-ui/react'

const Card = ({ label, children }) => {
  return (
    <Box bg={'white'} padding={'1rem'}>
      <Text fontWeight={'bold'}>{label}</Text>
      {children}
    </Box>
  )
}

export default Card
