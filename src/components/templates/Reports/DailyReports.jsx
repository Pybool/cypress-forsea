import React, { useState } from 'react'

import { DateTime } from 'luxon'

import { useSearchParams } from 'react-router-dom'

import uniq from 'lodash/uniq'

import {
  Container,
  Heading,
  Stack,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  Button,
  Box,
} from '@chakra-ui/react'

import { RepeatIcon } from '@chakra-ui/icons'

import HeaderWrapper from './modules/HeaderWrapper'
import Search from './modules/Search'

import Loader from '@harmony/molecules/Loader'

import { useReportsMulti } from '@harmony/hooks/useReports'
import useRedemptions from '@harmony/hooks/useRedemptions'
import { useGetAllOrders } from '@harmony/hooks/useGetOrdersList'

import report_layout from './report_layout.json'

import hut_settings from '../QueueControl/hut_settings'

import parseGuests from '@harmony/libs/parseGuests'

import OutputBar from './modules/OutputBar'

import { list_items } from './dataFilters'

import { mergeData } from './helpers'

const hut_list = hut_settings.map(({ id }) => id)

const getQuantity = (tickets) =>
  tickets.reduce((acc, cur) => {
    return acc + cur.qty
  }, 0)

const mergeGuests = (data) => {
  const { adult_tickets, carer_tickets, child_tickets } = data

  const adults = getQuantity(adult_tickets) + getQuantity(carer_tickets)
  const children = getQuantity(child_tickets)

  return `${adults > 0 ? `${adults} Adult${adults > 1 ? 's' : ''}` : ''}${children > 0 ? `, ${children} Children` : ''}`
}

const table_filters = {
  woodland_check_not: {
    filter: (data, redemptions) => {
      if (data) {
        const { service_dates } = data

        const redeemed = uniq(
          redemptions
            .filter(({ redemptions }) =>
              redemptions.some(({ location }) => location === 'lap_fc_woodland'),
            )
            .map(({ order_id }) => order_id),
        )

        return service_dates
          .reduce((acc, cur) => {
            const { orders } = cur

            orders.forEach((order) => {
              if (!redeemed.includes(order.id)) acc.push(order)
            })

            return acc
          }, [])
          .map((order) => {
            const {
              id,
              booked_unit,
              lead_info,
              adult_tickets,
              child_tickets,
              carer_tickets,
            } = parseGuests(order)

            return {
              lead: `${lead_info.firstname} ${lead_info.lastname}`,
              group: mergeGuests({
                adult_tickets,
                child_tickets,
                carer_tickets,
              }),
              tour_time: DateTime.fromISO(booked_unit.start_time).toFormat('T'),
              order_id: id,
            }
          })
      }

      return []
    },
  },
  compass_check_not: {
    filter: (data, redemptions) => {
      if (data) {
        const { service_dates } = data

        const redeemed = uniq(
          redemptions
            .filter(({ redemptions }) => redemptions.some(({ location }) => location === 'lap_fc_compass'))
            .map(({ order_id }) => order_id),
        )

        return service_dates
          .reduce((acc, cur) => {
            const { orders } = cur

            orders.forEach((order) => {
              if (!redeemed.includes(order.id)) acc.push(order)
            })

            return acc
          }, [])
          .map((order) => {
            const {
              id,
              booked_unit,
              lead_info,
              adult_tickets,
              child_tickets,
              carer_tickets,
            } = parseGuests(order)

            return {
              lead: `${lead_info.firstname} ${lead_info.lastname}`,
              group: mergeGuests({
                adult_tickets,
                child_tickets,
                carer_tickets,
              }),
              tour_time: DateTime.fromISO(booked_unit.start_time).toFormat('T'),
              order_id: id,
            }
          })
      }

      return []
    },
  },
}

const getData = (block, data, redemptions) => {
  const { type, items, filter } = block

  if (type === 'table') return table_filters[filter].filter(data, redemptions)

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

const DailyReports = () => {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()

  const [
    report,
    setReport,
  ] = useState(0)

  const [
    picker,
    setPicker,
  ] = useState(searchParams.get('picker') || DateTime.local().toISODate())

  const handleSetDate = (value) => {
    setSearchParams(`picker=${value}`)
    setPicker(value)
  }

  const current = report_layout[report]

  const {
    isFetching: reportsFetching,
    data: stats,
  } = useReportsMulti({
    service_ids: ['service_lapland', 'preview_day', 'harmony_test_days'],
    params: {
      addons: current.filterAddon,
      'service-date-start': picker,
      'service-date-end': picker,
      'service-time-end': current.time,
    },
  })

  const {
    isFetching: redemptionsFetching,
    data: redemptions,
  } = useRedemptions(
    {
      locations: ['lap_fc_woodland', 'lap_fc_compass', ...hut_list, 'lap_fc_complete'],
      from: picker,
      to: picker,
      filter: 'last',
    },
    1000 * 60 * 10,
  )

  const {
    isFetching: ordersFetching,
    data: orders,
    invalidate,
  } = useGetAllOrders({
    date: picker,
  })

  const merged = mergeData(stats, redemptions, orders, current.filterAddon)

  const { block_a, block_b } = current

  const BlockAComponent = block_a.type === 'list' ? OutputBar : OutputTable
  const BlockBComponent = block_b.type === 'list' ? OutputBar : OutputTable

  const options = report_layout.map((option, index) => ({
    label: option.title,
    value: index,
  }))

  const isFetching = reportsFetching || redemptionsFetching || ordersFetching

  return (
    <Container maxW={'100%'} padding={'0'}>
      <HeaderWrapper title={'Daily reports'}>
        <Search
          options={options}
          report={report}
          picker={picker}
          setReport={setReport}
          setPicker={handleSetDate}
        />
        <Box position={'absolute'} top={'1rem'} right={'2rem'}>
          <Button
            bg={'white'}
            color={'failure'}
            border={'1px solid var(--chakra-colors-failure)'}
            onClick={invalidate}
            leftIcon={<RepeatIcon />}
            isLoading={isFetching}
          >
            {'Refresh'}
          </Button>
        </Box>
      </HeaderWrapper>
      <Stack direction={'column'} gap={'1rem'} padding={'2rem 2rem 10rem 2rem'}>
        <Heading as={'h3'} size={'md'}>
          {current.sub_title}
        </Heading>
        <BlockAComponent
          data={getData(block_a, merged, redemptions)}
          block={block_a}
        />
        <BlockBComponent
          data={getData(block_b, merged, redemptions)}
          block={block_b}
        />
      </Stack>
      {isFetching && <Loader />}
    </Container>
  )
}

const column_map = {
  lead: 'Lead booker',
  group: 'Group',
  tour_time: 'Tour time',
  order_id: 'Order reference',
}

const getTableData = (columns, data) => {
  return data.map((row) => {
    return columns.reduce((acc, cur) => {
      acc[cur] = row[cur]

      return acc
    }, {})
  })
}

const OutputTable = ({ data, block }) => {
  const { items } = block

  const table_data = getTableData(items, data)

  return (
    <TableContainer>
      <Table variant={'striped'} bg={'white'} borderRadius={'1rem'}>
        <Thead>
          <Tr>
            {items.map((key) => {
              return (
                <Th key={key}>{column_map[key]}</Th>
              )
            })}
          </Tr>
        </Thead>
        <Tbody>
          {table_data.map((item, index) => {
            return (
              <Tr key={index}>
                {items.map((column, index) => {
                  return (
                    <Td key={index}>{item[column]}</Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default DailyReports
