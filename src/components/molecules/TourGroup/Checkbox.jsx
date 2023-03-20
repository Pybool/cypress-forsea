import React from 'react'

import { Fade, Flex, useCheckbox } from '@chakra-ui/react'

import Icon from '@harmony/atoms/Icon'

const Checkbox = ({
  enabled,
  onChange,
  isChecked,
  readOnly,
  ...props
}) => {
  const { state, getCheckboxProps, getInputProps } = useCheckbox({
    isChecked,
    onChange,
    isReadOnly: readOnly,
  })

  return (
    <Flex
      className={'chakra-harmony-checkbox'}
      align={'center'}
      justify={'center'}
      bg={state.isChecked ? 'var(--harmony-brand)' : 'white'}
      border={'1px solid'}
      borderColor={'var(--harmony-brand)'}
      borderRadius={'full'}
      boxSizing={'initial'}
      transition={'background-color 0.12s, border-color 0.12s'}
      w={'1.75rem'}
      h={'1.75rem'}
      {...props}
      {...getCheckboxProps()}
    >
      <input {...getInputProps()} hidden />
      <Fade in={enabled}>
        <Flex align={'center'} justify={'center'}>
          <Icon
            transition={'color 0.12s'}
            name={'MdLink'}
            height={5}
            color={state.isChecked ? 'white' : 'var(--harmony-brand)'}
            transform={'rotate(-45deg)'}
          />
        </Flex>
      </Fade>
    </Flex>
  )
}

export default Checkbox
