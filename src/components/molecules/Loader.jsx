import React from 'react'

import { Center, Spinner } from '@chakra-ui/react'

const Loader = ({
  ...override
}) => {
  return (
    <Center
      position={'absolute'}
      top={'0'}
      right={'0'}
      left={'0'}
      height={'100vh'}
      bg={'rgba(255,255,255,0.75)'}
      {...override}
    >
      <Spinner color={'dark-blue'} size={'xl'} />
    </Center>
  )
}

export default Loader
