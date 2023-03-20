import React from 'react'

import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import areasConfig from '@harmony/config'

import {
  Box,
  Container,
  Text,
  useBoolean,
} from '@chakra-ui/react'

import Detail from '@harmony/templates/Detail'
import Search from './Search'
import useSearch from '@harmony/hooks/useSearch'
import useGetOrdersList from '@harmony/hooks/useGetOrdersList'
import ToursSort from '@harmony/organisms/ToursSort'
import ToursLink from '@harmony/organisms/ToursLink'
import { totalQuantityByTicketId } from '@harmony/libs/totals'
import Mininav from '@harmony/molecules/Mininav'
import Back from '@harmony/atoms/Button/Back'
import TourSwitch from '@harmony/atoms/Button/TourSwitch'
import { getTimeToNearest30, getTodaysDate } from '@harmony/libs/time'



const decorate = ({ data = [], pagination }) => ({
  data: data
    .filter(({ status }) => status !== 'cancelled')
    .map(({ revision, id, customer, items, extensions, linked_orders = [] }) => {
      const { firstname, lastname } = customer
      const { booked_unit, addons } = items[0]
      const { start_date, start_time } = booked_unit
      const [hour, minute] = start_time.split(':')

      const tickets = items.flatMap((item) => item.ticket_types)

      const is_vip = addons.some((cur) => cur.parent.id === 'golden_experience') || extensions.is_vip || false

      return {
        id: revision,
        firstName: firstname,
        surname: lastname,
        orderRef: id,
        date: start_date,
        time: `${hour}:${minute}`,
        extensions,
        links: linked_orders.map(({ order_id }) => order_id),
        tickets,
        adults: totalQuantityByTicketId(tickets, 'tt_adult'),
        children: totalQuantityByTicketId(tickets, 'tt_children_under_13') + totalQuantityByTicketId(tickets, 'tt_infant'),
        wheelchair: totalQuantityByTicketId(tickets, 'tt_wheelchair'),
        vip: is_vip,
      }
    }),
  pagination,
})

const Tours = () => {
  const params = useParams()
  const [searchParams] = useSearchParams()

  const area = areasConfig[params.id]

  const navigate = useNavigate()

  const [isLinking, setIsLinking] = useBoolean(false)

  const {
    filters,
    searchByDate,
    searchByTime,
    searchByText,
  } = useSearch({
    date: searchParams.get('date') || getTodaysDate(),
    time: searchParams.get('time') || getTimeToNearest30(),
  })

  const {
    isFetching,
    isSuccess,
    isError,
    data,
    invalidate,
  } = useGetOrdersList({
    params: {
      name: filters.name,
      booking_date_start: filters.date,
      booking_date_end: filters.date,
      booking_time_start: filters.time,
      booking_time_end: filters.time,
      page: 1,
      per_page: 400,
    },
    decorate,
  })

  const hasDateOrTime = (filters.dateRange || []).some((range) => range != undefined) || filters.time

  const isEmpty = !isSuccess || (isSuccess && data?.pagination?.total === 0)

  const linkToggle = () => {
    setIsLinking.toggle()
  }

  if (isError) return null

  return (
    <Detail
      sx={{ '--harmony-brand': area.color }}
      header={area}
      menu={area.landing}
      mininav={
        <Mininav
          left={<Back onClick={() => navigate(-1)} />}
          right={
            <TourSwitch defaultChecked={isLinking} onChange={linkToggle}>
              {'Group linking'}
            </TourSwitch>
          }
        />
      }
      search={
        <Search
          id={'tour-search'}
          title={'Tour Sorting'}
          placeholder={'Search tours'}
          initialDate={filters.date}
          time={filters.time}
          initialSearch={filters.search}
          dateChange={searchByDate}
          timeChange={searchByTime}
          searchChange={searchByText}
          startHour={'08:00'}
          endHour={'18:00'}
          showEmptyValue={false}
        />
      }
    >
      <Box minHeight={'20rem'}>
        <Container centerContent maxW={'xl'}>
          <Text fontSize={'md'} m={6} textAlign={'center'}>
            {'Automatic tour allocation has been applied. Change an order\'s allocation by dragging the order from one column to the other.'}
          </Text>
        </Container>
        {hasDateOrTime && isEmpty && (
          <Container centerContent maxW={'xl'}>
            <Text fontSize={'md'} fontWeight={'extrabold'} m={6} textAlign={'center'}>
              {'There seem to be no tours for this date range and time.'}
              <br />
              {'Please try another date range or time.'}
            </Text>
          </Container>
        )}
        {!hasDateOrTime && (
          <Container centerContent maxW={'xl'}>
            <Text fontSize={'md'} fontWeight={'extrabold'} m={6} textAlign={'center'}>
              {'Please select a date and time.'}
            </Text>
          </Container>
        )}
        {hasDateOrTime &&
          (!isEmpty && isLinking ? (
            <ToursLink
              area={area}
              orders={data?.data}
              updateOrders={invalidate}
              isFetching={isFetching}
            />
          ) : (
            <ToursSort
              area={area}
              orders={data?.data}
              updateOrders={invalidate}
              selected={searchParams.get('order') || null}
              isFetching={isFetching}
            />
          ))}
      </Box>
    </Detail>
  )
}

export default Tours
