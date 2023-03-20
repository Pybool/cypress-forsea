import React from 'react'

import { Button } from '@chakra-ui/react'

const ActionSubmit = ({ label, isLoading, disabled, ...rest }) => {
  return (
    <Button
      type={'submit'}
      width={'100%'}
      disabled={disabled}
      isLoading={isLoading}
      color={'white'}
      background={'dark-blue'}
      _disabled={{
        background: 'grey2',
      }}
      _hover={{
        background: disabled ? 'grey3' : 'mid-blue',
      }}
      {...rest}
    >
      {label}
    </Button>
  )
}

export default ActionSubmit
