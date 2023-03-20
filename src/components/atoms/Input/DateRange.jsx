import { useState, useRef, forwardRef } from 'react'
import 'react-calendar/dist/Calendar.css'
import Calendar from 'react-calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  useDisclosure,
  useOutsideClick,
  SimpleGrid,
} from '@chakra-ui/react'
import noop from '@harmony/libs/noop'
import { FakeDateInput as DateInput } from '@harmony/atoms/Input/Date'
import Button from '@harmony/atoms/Button/Base'

const ClearButton = ({ onClick, onKeyPress }) => (
  <Button
    onClick={onClick}
    onKeyPress={onKeyPress}
    bg="white"
    border="none"
    borderRight="1px solid var(--chakra-colors-grey2)"
    borderRadius="0"
    fontSize="inherit"
    fontWeight="bold"
    _hover={{ bg: 'var(--chakra-colors-blackAlpha-100)' }}
  >
    Clear
  </Button>
)

const CloseButton = forwardRef((props, ref) => (
  <PopoverCloseButton
    ref={ref}
    {...props}
    pos="static"
    w="auto"
    h="auto"
    fontSize="inherit"
    fontWeight="bold"
    borderRadius="0"
  >
    Close
  </PopoverCloseButton>
))

const formatDate = (date) => {
  return date ? date.toISOString().split('T')[0] : ''
}

const removeTimezone = (date) => {
  if (date == null) return date

  const dateWithoutTimezone = new Date(date)
  dateWithoutTimezone.setMinutes(
    dateWithoutTimezone.getMinutes() - dateWithoutTimezone.getTimezoneOffset(),
  )
  return dateWithoutTimezone
}

const getInitialDates = (dateStrs) =>
  dateStrs?.map((dateStr) => (dateStr != null ? new Date(dateStr) : undefined))

const DateRange = ({
  label,
  initialDateRange,
  isDisabled,
  onChange = noop,
  ...rest
}) => {
  const [dates, setDates] = useState(getInitialDates(initialDateRange))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
  const calendarRef = useRef(null)

  useOutsideClick({
    ref: calendarRef,
    handler: onClose,
    enabled: isOpen,
  })

  function reportChange(dates) {
    onChange(dates?.map(formatDate))
  }

  function onCalendarChange(newDate) {
    setDates([newDate, newDate])
    reportChange([newDate, newDate]?.map(removeTimezone))
  }

  function onInputChange({ target }) {
    const newDate = target.valueAsDate
    if (newDate == null) {
      setDates(undefined)
      reportChange(undefined)
      return onClose()
    }

    setDates([newDate, newDate])
    reportChange([newDate, newDate])
  }

  function parseDateForInput(date) {
    return date ? formatDate(removeTimezone(date)) : ''
  }

  function clearDates() {
    setDates(undefined)
    reportChange(undefined)
    onClose()
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} returnFocusOnClose={false} isLazy>
      <PopoverTrigger>
        <DateInput
          label={label}
          onClick={onOpen}
          ref={initialRef}
          onChange={onInputChange}
          value={parseDateForInput(dates?.at(0))}
          {...rest}
        />
      </PopoverTrigger>
      <PopoverContent
        p={0}
        w="min-content"
        border="none"
        outline="none"
        _focus={{ boxShadow: 'none' }}
        ref={calendarRef}
      >
        <Calendar
          allowPartialRange
          value={dates}
          onChange={onCalendarChange}
          selectRange={false}
        />
        <SimpleGrid
          columns={2}
          border="1px solid"
          borderColor="grey2"
          borderTop="none"
        >
          <ClearButton onClick={clearDates} onKeyPress={clearDates} />
          <CloseButton />
        </SimpleGrid>
      </PopoverContent>
    </Popover>
  )
}

export default DateRange
