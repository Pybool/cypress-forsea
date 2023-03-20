import React from 'react'

import { Box, Heading } from '@chakra-ui/react'

const Header = ({ title }) => {
  return (
    <Box as={'header'} pt={'1.75rem'} pb={'0.5rem'}>
      {title && (
        <Heading as={'h2'} size={'lg'} fontWeight={'extrabold'} color={'dark-blue'}>
          {title}
        </Heading>
      )}
    </Box>
  )
}

export default Header
