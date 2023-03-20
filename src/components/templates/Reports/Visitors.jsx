import React, { useState } from 'react'

import { DateTime } from 'luxon'

import { useSearchParams } from 'react-router-dom'

import { Container, Stack } from '@chakra-ui/react'

import HeaderWrapper from './modules/HeaderWrapper'
import {
  Wrapper,
  // DayMenu,
  DatePicker,
} from './modules/Search'

import OutputBar from './modules/OutputBar'

import { useReportsMulti } from '@harmony/hooks/useReports'
import useRedemptions from '@harmony/hooks/useRedemptions'
import useGetOrdersList from '@harmony/hooks/useGetOrdersList'

import Loader from '@harmony/molecules/Loader'

import GraphCumulative from './modules/GraphCumulative'
import GraphVisitsGroup from './modules/GraphVisitsGroup'
import GraphByTime from './modules/GraphByTime'

import hut_settings from '../QueueControl/hut_settings'

import { list_items } from './dataFilters'

import { mergeData } from './helpers'

const hut_list = hut_settings.map(({ id }) => id)

const items = ['woodland_check', 'compass_check', 'fc_check', 'compass_wait']

const getData = (items, data, redemptions) => {
  return items
    .filter((item) => list_items[item])
    .map((item) => {
      const { value, details, ...rest } = list_items[item]

      return {
        ...rest,
        ...(value ? { value: value(data, redemptions) } : {}),
        ...(details ? { details: details(data, redemptions) } : {}),
      }
    })
}

const Visitors = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [date, setDate] = useState(searchParams.get('picker') || DateTime.local().toISODate())

  const {
    isFetching,
    data: stats,
  } = useReportsMulti({
    service_ids: ['service_lapland', 'preview_day', 'harmony_test_days'],
    params: {
      'service-date-start': date,
      'service-date-end': date,
    },
  })

  const { data: redemptions } = useRedemptions(
    {
      locations: ['lap_fc_compass', 'lap_fc_woodland', ...hut_list, 'lap_fc_complete'],
      from: date,
      to: date,
      filter: 'last',
    },
    1000 * 60 * 10,
  )

  const { data: orders } = useGetOrdersList({
    params: {
      booking_date_start: date,
      booking_date_end: date,
    },
  })

  const handleSetDate = (value) => {
    setSearchParams(`picker=${value}`)
    setDate(value)
  }

  const merged = mergeData(stats, redemptions, orders)

  return (
    <Container maxW={'100%'} padding={'0'}>
      <HeaderWrapper title={'FC Visit Statistics'}>
        <Wrapper>
          <DatePicker
            value={date}
            change={handleSetDate}
            width={'12rem'}
            height={'4rem'}
          />
        </Wrapper>
      </HeaderWrapper>
      <Stack
        direction={'column'}
        spacing={'1.5rem'}
        padding={'2rem 2rem 10rem 2rem'}
      >
        <OutputBar data={getData(items, merged, redemptions)} />
        <GraphCumulative date={date} data={merged} redemptions={redemptions} />
        <GraphVisitsGroup date={date} data={merged} redemptions={redemptions} />
        <GraphByTime date={date} data={merged} redemptions={redemptions} />
      </Stack>
      {isFetching && (
        <Loader />
      )}
    </Container>
  )
}

export default Visitors
