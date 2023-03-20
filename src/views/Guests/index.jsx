import React, { useState } from 'react'

import { useParams, useNavigate } from 'react-router-dom'

import areasConfig from '@harmony/config'

import { getTimeToNearest30, getTodaysDate } from '@harmony/libs/time'

import {
  Box,
  Flex,
  HStack,
} from '@chakra-ui/react'

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@harmony/atoms/Table'

import Detail from '@harmony/templates/Detail'
import Search from '@harmony/organisms/Search'
import Pagination from '@harmony/organisms/Pagination'
import Icon from '@harmony/atoms/Icon'
import Select from '@harmony/atoms/Select'
import ViewButton from '@harmony/atoms/Button/View'
import SortButton from '@harmony/atoms/Button/Sort'
import SimplePrintConfirmation from '@harmony/molecules/Drawer/SimplePrint'
import GoodList from '@harmony/views/PrintPreview/GoodList'

import useSearch from '@harmony/hooks/useSearch'
import usePagination from '@harmony/hooks/usePagination'
import useGetOrdersList from '@harmony/hooks/useGetOrdersList'
import useRedemptions from '@harmony/hooks/useRedemptions'
import Back from '@harmony/atoms/Button/Back'
import Mininav from '@harmony/molecules/Mininav'
import useSorting from '@harmony/hooks/useSorting'
import useSessionState from '@harmony/hooks/useSessionState'

const decorate = ({ data = [], pagination }) => ({
  data: data
    .filter(({ status }) => status !== 'cancelled')
    .map(({ revision, id, customer, items, linked_orders, extensions }) => {
      const { firstname, lastname } = customer
      const { booked_unit, addons } = items[0]
      const { start_date, start_time, end_date } = booked_unit
      const [hour, minute] = start_time.split(':')

      const is_vip = addons.some((cur) => cur.parent.id === 'golden_experience') || extensions.is_vip || false
      const wheelchair = items?.[0].ticket_types.filter(({ id }) => id === 'tt_wheelchair').length > 0 || false
      const isLinked = linked_orders?.length > 0 || false

      return {
        id: revision,
        vip: is_vip,
        surname: lastname,
        firstName: firstname,
        orderRef: id,
        date: start_date,
        start_date,
        end_date,
        in: false,
        time: `${hour}:${minute}`,
        req: { wheelchair, isLinked },
      }
    }),
  pagination,
})

const isOrderId = (text = '') => text.match(/^lao/i)
const isName = (text) => !isOrderId(text)

const Guests = () => {
  const navigate = useNavigate()
  const params = useParams()

  const area = areasConfig[params.id]

  const [sessionFilters, setSessionFilters] = useSessionState({
    key: 'guest-filters',
    initial: {
      dateRange: [getTodaysDate(), undefined],
      time: getTimeToNearest30(),
    },
  })

  const [sessionPaginate, setSessionPaginate] = useSessionState({
    key: 'guest-pagination',
    initial: {
      page: 1,
      pageSize: 10,
    },
  })

  const {
    filters,
    searchByDateRange,
    searchByTime,
    searchByText,
  } = useSearch({
    onChange: setSessionFilters,
    ...sessionFilters,
  })

  const {
    currentPage,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
  } = usePagination({
    initialPage: sessionPaginate.page,
    initialPageSize: sessionPaginate.pageSize,
    onChange: setSessionPaginate,
  })

  const { sortBy, sortDirection, setSortBy } = useSorting()

  const sortString = sortBy && `${sortBy}${sortDirection === 'none' ? '' : `:${sortDirection}`}`

  const {
    isError,
    data: response = {},
  } = useGetOrdersList({
    params: {
      name: isName(filters.name) ? filters.name : undefined,
      ref: isOrderId(filters.orderId) ? filters.orderId : undefined,
      booking_date_start: filters.dateRange?.at(0),
      booking_date_end: filters.dateRange?.at(1) || filters.dateRange?.at(0),
      booking_time_start: filters.time,
      booking_time_end: filters.time,
      page: currentPage,
      per_page: pageSize,
      sort: sortString,
    },
    decorate,
  })

  const { data: redemptions } = useRedemptions(
    {
      locations: ['lap_fc_compass', 'lap_fc_woodland'],
      from: filters.dateRange?.at(0),
      to: filters.dateRange?.at(1) || filters.dateRange?.at(0),
      filter: 'all',
    },
    1000 * 60 * 10,
  )

  const { data: orders = [], pagination = {} } = response
  const { last_page: lastPage } = pagination

  const [
    printConfirm,
    setPrintConfirm,
  ] = useState(undefined)

  const confirmPrint = () => {
    navigate(printConfirm)
  }

  if (isError) return null

  const filtered = orders.map((order) => {
    const found = redemptions.find(({ order_id }) => order_id === order.orderRef)

    return {
      ...order,
      in: Boolean(found),
    }
  })

  return (
    <Detail
      paddingBottom={'2rem'}
      sx={{ '--harmony-brand': area.color }}
      header={area}
      menu={area.landing}
      mininav={<Mininav left={<Back onClick={() => navigate(-1)} />} />}
      search={
        <Search
          id={'guest-search'}
          title={'Search Guests'}
          placeholder={'Search by name / order'}
          initialDateRange={filters.dateRange}
          time={filters.time}
          initialSearch={filters.name || filters.orderRef}
          dateRangeChange={searchByDateRange}
          timeChange={searchByTime}
          searchChange={searchByText}
          filterChange={() => goToPage(1)}
          startHour={'08:00'}
          endHour={'18:00'}
        />
      }
    >
      <Flex margin={'1.5rem 2.25rem'}>
        <Box ml={'auto'}>
          <Select
            placeholder={'Print'}
            options={[{ value: 'good-list', label: 'Good list' }]}
            change={(value) => setPrintConfirm(`/print/${value}/${filters.dateRange?.at(0) || filters.date}`)}
          />
        </Box>
      </Flex>
      <TableContainer mx={'2.25rem'} mt={'1.5rem'} mb={'9rem'} minHeight={'9rem'}>
        <Table variant={'striped'}>
          <Thead background={'white'} borderBottom={'1px solid var(--chakra-colors-grey3)'}>
            <Tr>
              <Th>{'VIP'}</Th>
              <Th>
                <SortButton
                  name={'surname'}
                  onClick={() => setSortBy('lastname')}
                  active={sortBy === 'lastname'}
                  direction={sortDirection}
                >
                  {'Surname'}
                </SortButton>
              </Th>
              <Th>{'First Name'}</Th>
              <Th>{'Order Ref.'}</Th>
              <Th>{'In'}</Th>
              <Th>{'Time'}</Th>
              <Th>{'Req'}</Th>
              <Th>{''}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((guest) => {
              return (
                <Tr
                  key={guest.id}
                  checkedIn={guest.in}
                  onClick={() => navigate(`/area/${params.id}/guests/${guest.orderRef}`)}
                  cursor={'pointer'}
                >
                  <Td>{guest.vip ? <Icon name={'MdStar'} height={'1.25rem'} /> : ''}</Td>
                  <Td>{guest.surname || ''}</Td>
                  <Td>{guest.firstName || ''}</Td>
                  <Td>{guest.orderRef || ''}</Td>
                  <Td>{guest.in ? <Icon name={'MdCheckCircleOutline'} height={'1.25rem'} /> : ''}</Td>
                  <Td>{guest.time || ''}</Td>
                  <Td>
                    <HStack spacing={'0.5rem'}>
                      {guest.req.wheelchair && (
                        <Icon name={'MdAccessible'} height={'1.25rem'} />
                      )}
                      {guest.req.isLinked && (
                        <Icon
                          name={'MdLink'}
                          height={'1.25rem'}
                          transform={'rotateZ(-45deg)'}
                        />
                      )}
                    </HStack>
                  </Td>
                  <Td>
                    <ViewButton onClick={() => {}}>{'View'}</ViewButton>
                  </Td>
                </Tr>
              )})}
          </Tbody>
        </Table>
      </TableContainer>
      <SimplePrintConfirmation
        title={'Print Good List'}
        isOpen={!!printConfirm}
        onClose={() => setPrintConfirm(undefined)}
        onConfirm={confirmPrint}
        confirmationLabel={'Print Good List'}
      >
        <GoodList date={filters.dateRange?.at(0) || filters.date || getTodaysDate()} />
      </SimplePrintConfirmation>
      <Flex
        bg={'white'}
        justifyContent={'space-between'}
        alignItems={'center'}
        height={'7rem'}
        px={9}
        position={'fixed'}
        bottom={'0'}
        w={'100%'}
      >
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          changePageSize={changePageSize}
          nextPage={nextPage}
          prevPage={prevPage}
          goToPage={goToPage}
          totalPages={lastPage}
        />
      </Flex>
    </Detail>
  )
}

export default Guests
