import React from 'react'

import noop from '@harmony/libs/noop'
import Icon from '@harmony/atoms/Icon'
import Button from './Base'

const ViewButton = ({ children, onClick = noop, ...props }) => (
  <Button
    onClick={onClick}
    fontFamily={'heading'}
    fontWeight={'extrabold'}
    fontSize={'inherit'}
    textTransform={'uppercase'}
    color={'var(--harmony-brand-primary, #6FC0C6)'}
    borderColor={'currentColor'}
    borderWidth={'1px'}
    borderStyle={'solid'}
    borderRadius={'100vh'}
    background={'transparent'}
    rightIcon={<Icon name={'MdArrowForward'} height={'1.25rem'} />}
    _hover={{
      background: 'var(--harmony-brand-primary, #6FC0C6)',
      color: 'var(--chakra-colors-white)',
    }}
    {...props}
  >
    {children}
  </Button>
)

export default ViewButton
