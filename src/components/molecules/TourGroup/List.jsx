import React, { forwardRef } from 'react'
import { VStack } from '@chakra-ui/react'

const List = forwardRef(({ children, ...rest }, ref) => (
  <VStack
    spacing={'1rem'}
    align={'stretch'}
    h={'100%'}
    w={'100%'}
    px={'1rem'}
    ref={ref}
    {...rest}
  >
    {children}
  </VStack>
))

export default List
