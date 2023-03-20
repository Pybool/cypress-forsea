import React from 'react'

import { Select } from '@chakra-ui/react'

const InputSelect = ({ placeholder, options, change, ...rest }) => {
  const handleChange = (event) => {
    change(event.target.value)
  }

  return (
    <Select
      onChange={handleChange}
      bg="white"
      color="dark-blue"
      value=""
      {...rest}
    >
      <option hidden disabled value="">
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}

export default InputSelect
