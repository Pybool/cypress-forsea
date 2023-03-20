import React from 'react'

import { Input, FormControl, FormLabel } from '@chakra-ui/react'

const InputText = ({
  label,
  field,
  value,
  change,
  placeholder,
  type = 'text',
  ...rest
}) => {
  const handleChange = (event) => {
    change(field, event.target.value)
  }

  return (
    <FormControl>
      <FormLabel fontSize={'0.75rem'}>{label}</FormLabel>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        type={type}
        size={'md'}
        variant={'flushed'}
        bg={'white'}
        padding={'0.5rem 1rem'}
        borderBottom={'1px solid black'}
        borderColor={'black'}
        {...rest}
      />
    </FormControl>
  )
}

export default InputText
