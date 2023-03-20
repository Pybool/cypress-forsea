import React from 'react'

import { Box, Heading } from '@chakra-ui/react'

const HeaderWrapper = ({ title, children }) => {
  return (
    <Box
      position={'relative'}
      width={'100%'}
      padding={'4rem 2rem 2rem 2rem'}
      background={'white'}
    >
      <Heading as={'h2'} marginBottom={'1rem'} textAlign={'center'}>
        {title}
      </Heading>
      {children}
    </Box>
  )
}

export default HeaderWrapper
