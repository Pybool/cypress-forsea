import React from 'react'

import { Center, Spinner } from '@chakra-ui/react'

const Splash = () => {
  return (
    <Center w={'100vw'} h={'100vh'} bg={'rgb(60, 60, 59)'}>
      <Spinner color={'rgb(255,255,255)'} size={'xl'} />
    </Center>
  )
}

export default Splash
