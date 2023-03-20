import React from 'react'

import {
  Heading,
  Container,
  Grid,
  Input,
  Flex,
  VisuallyHidden,
} from '@chakra-ui/react'

import SearchInput from '@harmony/atoms/Input/Search'
import Time from '@harmony/atoms/Input/Time'

/**
 * Search component
 */
const Search = ({
  title,
  placeholder,
  time,
  initialDate,
  initialSearch,
  timeChange,
  dateChange,
  searchChange,
  isDisabled,
  startHour = '00:00',
  endHour = '23:30',
  showEmptyValue = true,
}) => (
  <>
    <Container centerContent>
      <Heading as={'h2'} mt={4} mb={4}>
        {title}
      </Heading>
    </Container>
    <Grid templateColumns={'repeat(12, 1fr)'} gap={6}>
      <SearchInput
        gridColumn={'span 7'}
        label={'Search:'}
        placeholder={placeholder}
        onChange={searchChange}
        defaultValue={initialSearch}
        isDisabled={isDisabled}
      />
      <DatePicker
        gridColumn={'span 3'}
        label={'Date range:'}
        value={initialDate}
        onChange={event => dateChange(event.target.value)}
        isDisabled={isDisabled}
      />
      <Time
        gridColumn={'span 2'}
        label={'Time:'}
        time={time}
        timeChange={timeChange}
        isDisabled={isDisabled}
        startHour={startHour}
        endHour={endHour}
        showEmptyValue={showEmptyValue}
      />
    </Grid>
  </>
)

const DatePicker = ({
  label,
  value,
  change,
  disabled,
  ...rest
}) => {
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
      padding={'0 1rem'}
      {...rest}
    >
      <VisuallyHidden as={'span'}>{label}</VisuallyHidden>
      <Input
        type={'date'}
        value={value}
        onChange={change}
        color={'dark-blue'}
        fontFamily={'heading'}
        fontSize={'xl'}
        fontWeight={'extrabold'}
        padding={0}
        border={0}
        textAlign={'center'}
        disabled={disabled}
      />
    </Flex>
  )
}

export default Search
