/* eslint-disable quotes */
import React, { forwardRef } from 'react'
import {
  Flex,
  Input,
  VisuallyHidden,
} from '@chakra-ui/react'

import { DateTime } from 'luxon'

import noop from '@harmony/libs/noop'

function hijackEvent(event) {
  const { key, type } = event
  if (key === 'Enter' || key === ' ' || type === 'focus' || type === 'click') {
    event.preventDefault()
    event.stopPropagation()
  }
}

/**
 * Date component using native HTML input type="date"
 *
 * @param {String} initialDate - Initial date value
 * @param {Function} dateChange - Function to call when date value changes
 * @returns {JSX.Element} - Date component
 * @constructor
 * @example
 * <Date initialDate="2020-01-01" dateChange={(date) => console.log(date)} />
 * // Outputs:
 * // 2020-01-01
 */
const Date = forwardRef(
  (
    {
      label,
      initialDate,
      onChange = noop,
      value,
      dateChange = noop,
      isDisabled,
      preventNativePicker = false,
      ...rest
    },
    ref,
  ) => (
    <Flex
      as="label"
      border={0}
      borderTopRadius={1}
      borderBottomRadius={0}
      borderBottomColor="grey3"
      borderBottomWidth="2px"
      borderBottomStyle="solid"
      backgroundColor="#F5F2F2"
      alignItems="center"
      onClick={preventNativePicker ? hijackEvent : undefined}
      onFocus={preventNativePicker ? hijackEvent : undefined}
      onKeyDown={preventNativePicker ? hijackEvent : undefined}
      {...rest}
    >
      <VisuallyHidden as="span">{label}</VisuallyHidden>
      <Input
        sx={{
          '&::-webkit-calendar-picker-indicator': {
            display: 'none',
          },
          '&::-webkit-input-placeholder': {
            visibility: 'hidden !important',
          },
        }}
        border={0}
        lineHeight="1"
        color="dark-blue"
        fontFamily="heading"
        fontSize="xl"
        fontWeight="extrabold"
        p={0}
        textAlign="center"
        name="date"
        type="date"
        defaultValue={initialDate}
        value={value}
        onChange={(e) => {
          onChange(e)
          dateChange(e.target.valueAsDate?.toISOString().split('T')[0])
        }}
        disabled={isDisabled}
        ref={ref}
        onFocus={preventNativePicker ? hijackEvent : undefined}
        onKeyDown={preventNativePicker ? hijackEvent : undefined}
      />
    </Flex>
  ),
)

const FakeDateInput = forwardRef(({
  label,
  initialDate,
  value,
  isDisabled,
  ...rest
},
ref) => {
  return (
    <Flex
      as={'label'}
      border={0}
      borderTopRadius={1}
      borderBottomRadius={0}
      borderBottomColor={'grey3'}
      borderBottomWidth={'2px'}
      borderBottomStyle={'solid'}
      backgroundColor={'#F5F2F2'}
      alignItems={'center'}
      onClick={(event) => event.preventDefault()}
      onFocus={(event) => event.preventDefault()}
      onKeyDown={(event) => event.preventDefault()}
      {...rest}
    >
      <VisuallyHidden as={'span'}>{label}</VisuallyHidden>
      <Input
        border={0}
        lineHeight={'1'}
        color={'dark-blue'}
        fontFamily={'heading'}
        fontSize={'xl'}
        fontWeight={'extrabold'}
        p={0}
        textAlign={'center'}
        name={'date'}
        type={'text'}
        defaultValue={initialDate}
        value={DateTime.fromISO(value).toFormat("dd '/' LL '/' yyyy")}
        onChange={(event) => event.preventDefault()}
        disabled={isDisabled}
        ref={ref}
        onFocus={(event) => event.preventDefault()}
        onKeyDown={(event) => event.preventDefault()}
      />
    </Flex>
  )
})

export default Date

export {
  FakeDateInput,
}
