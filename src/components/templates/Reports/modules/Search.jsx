import React from 'react'

import {
  Flex,
  Select,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react'

import { ChevronDownIcon } from '@chakra-ui/icons'

const Search = ({
  options,
  report,
  picker,
  setReport,
  setPicker,
  type = 'date',
  pickerOptions,
  showReportPicker = true,
}) => {
  const handleChangeReport = (event) => {
    setReport(event.target.value)
  }

  const handleChangePicker = (value) => {
    setPicker(value)
  }

  const Picker = type === 'date' ? DatePicker : DayMenu

  return (
    <Wrapper justifyContent={showReportPicker ? 'space-between' : 'flex-end'}>
      {showReportPicker && (
        <RoundedSelect
          options={options}
          value={report}
          change={handleChangeReport}
        />
      )}
      <Picker
        options={pickerOptions}
        value={picker}
        change={handleChangePicker}
        width={'12rem'}
        height={'4rem'}
      />
    </Wrapper>
  )
}

const Wrapper = ({ children, ...rest }) => {
  return (
    <Flex
      gap={'2rem'}
      sx={{
        '.rounded-select': {
          paddingLeft: '2rem',
        },
      }}
      {...rest}
    >
      {children}
    </Flex>
  )
}

const RoundedSelect = ({ options, value, change }) => {
  return (
    <Select
      className={'rounded-select'}
      fontWeight={'bold'}
      height={'4rem'}
      background={'white'}
      borderWidth={'2px'}
      borderColor={'grey3'}
      borderRadius={'2rem'}
      value={value}
      onChange={change}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}

const DatePicker = ({ value, change, disabled, ...rest }) => {
  return (
    <Input
      type={'date'}
      value={value}
      onChange={(event) => change(event.target.value)}
      fontWeight={'bold'}
      background={'grey3'}
      disabled={disabled}
      {...rest}
    />
  )
}

const DayMenu = ({ options, value, change, ...rest }) => {
  const display = options.find((option) => option.value === value)

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        fontWeight={'bold'}
        background={'grey3'}
        {...rest}
      >
        {display ? display.label : 'Undefined'}
      </MenuButton>
      <MenuList>
        {options.map((option, index) => {
          return (
            <>
              <MenuItem key={`${option.value}${index}`} onClick={() => change(option.value)}>
                {option.label}
              </MenuItem>
              {option.divider && <MenuDivider />}
            </>
          )
        })}
      </MenuList>
    </Menu>
  )
}

export default Search

export {
  Wrapper,
  RoundedSelect,
  DatePicker,
  DayMenu,
}
