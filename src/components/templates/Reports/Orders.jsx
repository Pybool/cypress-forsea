import React, { useState } from 'react'

import { DateTime } from 'luxon'

import { useSearchParams } from 'react-router-dom'

import { Container, Stack } from '@chakra-ui/react'

import HeaderWrapper from './modules/HeaderWrapper'
import { DayMenu, Wrapper, DatePicker } from './modules/Search'

import OutputBar from './modules/OutputBar'

import GraphGroupsDaily from './modules/GraphGroupsDaily'

import { useReportsMulti } from '@harmony/hooks/useReports'
import useRedemptions from '@harmony/hooks/useRedemptions'
import useGetOrdersList from '@harmony/hooks/useGetOrdersList'

import Loader from '@harmony/molecules/Loader'

import { list_items } from './dataFilters'

import { mergeData } from './helpers'

import hut_settings from '../QueueControl/hut_settings'

const hut_list = hut_settings.map(({ id }) => id)

const items = ['group_total', 'adult_total', 'children_total', 'jingles_total']

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

const picker_options = [
  {
    label: 'Today',
    value: 'today',
    picker: {
      type: 'offset',
      from: 0,
      to: 0,
    },
    divider: false,
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    picker: {
      type: 'offset',
      from: -1,
      to: -1,
    },
    divider: true,
  },
  {
    label: 'Last 7 days',
    value: 'last_7',
    picker: {
      type: 'offset',
      from: -7,
      to: 0,
    },
    divider: false,
  },
  {
    label: 'Last 30 days',
    value: 'last_30',
    picker: {
      type: 'offset',
      from: -30,
      to: 0,
    },
    divider: true,
  },
  {
    label: 'Month to date',
    value: 'month_to_date',
    showPicker: true,
    picker: {
      type: 'date-start-offset',
      unit: 'month',
    },
    divider: false,
  },
  {
    label: 'Last month',
    value: 'last_month',
    showPicker: false,
    picker: {
      type: 'date-start',
      unit: 'month',
    },
    divider: true,
  },
  {
    label: 'Year to date',
    value: 'year_to_date',
    showPicker: true,
    picker: {
      type: 'date-start-offset',
      unit: 'year',
    },
    divider: false,
  },
  {
    label: 'Last year',
    value: 'last_year',
    showPicker: false,
    picker: {
      type: 'date-start',
      unit: 'year',
    },
    divider: true,
  },
  {
    label: 'Custom date',
    value: 'custom_date',
    showPicker: true,
    picker: {
      type: 'date',
    },
    divider: false,
  },
]

const getDateRange = (option, date) => {
  let from = 0
  let to = 0

  const { picker } = option

  if (picker.type === 'offset') {
    from = DateTime.local().plus({ days: picker.from }).toISODate()
    to = DateTime.local().plus({ days: picker.to }).toISODate()
  }

  if (picker.type === 'date') {
    from = date
    to = date
  }

  if (picker.type === 'date-start-offset') {
    from = DateTime.fromISO(date).startOf(picker.unit).toISODate()
    to = date
  }

  if (picker.type === 'date-start') {
    from = DateTime.local().startOf(picker.unit).toISODate()
    to = DateTime.local().toISODate()
  }

  return {
    from,
    to,
  }
}

const Orders = () => {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()

  const [
    date,
    setDate,
  ] = useState(DateTime.local().toISODate())

  const [
    picker,
    setPicker,
  ] = useState(searchParams.get('picker') || picker_options[0].value)

  const handleSetPicker = (value) => {
    setSearchParams(`picker=${value}`)
    setPicker(value)
  }

  const picked = picker_options.find((options) => options.value === picker)

  const { from, to } = getDateRange(picked, date)

  const start = from
  const end = to

  const {
    isFetching,
    data: stats,
  } = useReportsMulti({
    service_ids: ['service_lapland', 'preview_day', 'harmony_test_days'],
    params: {
      'service-date-start': start,
      'service-date-end': end,
    },
  })

  const { data: redemptions } = useRedemptions(
    {
      locations: ['lap_fc_compass', 'lap_fc_woodland', ...hut_list],
      from: start,
      to: end,
      filter: 'last',
    },
    1000 * 60 * 10,
  )

  const { data: orders } = useGetOrdersList({
    params: {
      booking_date_start: start,
      booking_date_end: end,
    },
  })

  const merged = mergeData(stats, redemptions, orders)

  return (
    <Container maxW={'100%'} padding={'0'}>
      <HeaderWrapper title={'Order Statistics'}>
        <Wrapper>
          <DayMenu
            options={picker_options}
            value={picker}
            change={handleSetPicker}
            width={'12rem'}
            height={'4rem'}
          />
          {picked.showPicker && (
            <DatePicker
              value={date}
              change={setDate}
              width={'12rem'}
              height={'4rem'}
            />
          )}
        </Wrapper>
      </HeaderWrapper>
      <Stack direction={'column'} gap={'1rem'} padding={'2rem 2rem 10rem 2rem'}>
        <OutputBar data={getData(items, merged, redemptions)} />
        <GraphGroupsDaily data={merged} />
      </Stack>
      {isFetching && <Loader />}
    </Container>
  )
}

export default Orders
