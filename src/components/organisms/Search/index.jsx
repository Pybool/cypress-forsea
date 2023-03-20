import React from 'react'

import { Heading, Container, Grid } from '@chakra-ui/react'
import SearchInput from '@harmony/atoms/Input/Search'
import Time from '@harmony/atoms/Input/Time'
import DateRange from '../../atoms/Input/DateRange'
import noop from '@harmony/libs/noop'

/**
 * Search component
 */
const Search = ({
  title,
  placeholder,
  time,
  initialDateRange,
  initialSearch,
  timeChange,
  dateRangeChange,
  searchChange,
  isDisabled,
  startHour = '00:00',
  endHour = '23:30',
  showEmptyValue = true,
  filterChange = noop,
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
        onChange={event => {
          searchChange(event)
          filterChange()
        }}
        defaultValue={initialSearch}
        isDisabled={isDisabled}
      />
      <DateRange
        gridColumn={'span 3'}
        label={'Date range:'}
        initialDateRange={initialDateRange}
        onChange={event => {
          dateRangeChange(event)
          filterChange()
        }}
        isDisabled={isDisabled}
      />
      <Time
        gridColumn={'span 2'}
        label={'Time:'}
        time={time}
        timeChange={(e) => {
          timeChange(e)
          filterChange()
        }}
        isDisabled={isDisabled}
        startHour={startHour}
        endHour={endHour}
        showEmptyValue={showEmptyValue}
      />
    </Grid>
  </>
)

export default Search
