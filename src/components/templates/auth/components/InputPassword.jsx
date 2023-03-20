import React, { useState } from 'react'

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

import {
  InputGroup,
  InputRightElement,
  Input,
  FormControl,
  FormLabel,
  Button,
} from '@chakra-ui/react'

const InputPassword = ({
  label,
  field,
  value,
  change,
  placeholder,
  isInvalid,
  ...rest
}) => {
  const [show, setShow] = useState(false)

  const handleChange = (event) => {
    change(field, event.target.value)
  }

  const handleClick = () => setShow(!show)

  return (
    <FormControl>
      <FormLabel fontSize={'0.75rem'}>{label}</FormLabel>
      <InputGroup variant={'flushed'} bg={'white'} {...rest}>
        <Input
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          type={show ? 'text' : 'password'}
          padding={'0.5rem 1rem'}
          borderBottom={'1px solid black'}
          borderColor={'black'}
          isInvalid={isInvalid}
        />
        <InputRightElement>
          <Button onClick={handleClick} bg={'transparent'}>
            {show && <ViewOffIcon />}
            {!show && <ViewIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  )
}

export default InputPassword
