import React, { useState } from 'react'

import { DateTime } from 'luxon'

import { useSearchParams, useParams, useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Container,
  Stack,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'

import { DownloadIcon } from '@chakra-ui/icons'

import { saveAs } from 'file-saver'

import sortBy from 'lodash/sortBy'

import HeaderWrapper from './modules/HeaderWrapper'
import Search from './modules/Search'

import Loader from '@harmony/molecules/Loader'

import useRedemptions from '@harmony/hooks/useRedemptions'

import hut_settings from '../QueueControl/hut_settings'

import OutputBar from './modules/OutputBar'

import ViewButton from '@harmony/atoms/Button/View'

import {
  castToIntegerOrFloat,
} from './helpers'

const hut_list = hut_settings.map(({ id }) => id)

const getAverage = (redemptions, fromLocations = [], toLocations = []) => {
  let value = '-'

  const hut_login_times = redemptions.reduce((acc, cur) => {
    const { redemptions } = cur

    const from = redemptions.find(({ location }) => fromLocations.includes(location))
    const to = redemptions.find(({ location }) => toLocations.includes(location))

    if (from && to) {
      const diff = DateTime.fromISO(to.scanned_at).diff(DateTime.fromISO(from.scanned_at), 'minutes')

      acc.push(diff.minutes)
    }

    return acc
  }, [])

  if (hut_login_times.length > 0) {
    value = hut_login_times.reduce((acc, cur) => acc + cur, 0) / hut_login_times.length
  }

  return `${castToIntegerOrFloat(value)} min`
}

const getAverageGroup = (redemptions) => {
  let value = '-'

  const groups = redemptions
    .reduce((acc, cur) => {
      const {
        tickets,
      } = cur

      return [...acc, tickets.length]
    }, [])

  if (groups.length > 0) {
    value = groups.reduce((acc, cur) => acc + cur, 0) / groups.length
  }

  return value !== '-' ? castToIntegerOrFloat(value) : value
}

const generateStats = (redemptions) => {
  return [
    {
      title: 'Visits',
      value: redemptions.length,
    },
    {
      title: 'AVG Compass Lobby Wait',
      value: getAverage(redemptions, ['lap_fc_compass'], hut_list),
    },
    {
      title: 'AVG Hut Visit Length',
      value: getAverage(redemptions, hut_list, ['lap_fc_complete']),
    },
    {
      title: 'AVG Group Size',
      value: getAverageGroup(redemptions),
    },
  ]
}

const formatDiff = (diff) => {
  return `${castToIntegerOrFloat(diff.minutes)} min`
}

// Excel won't treat ISO timestamps as dates, so need to change the output format
// See https://answers.microsoft.com/en-us/msoffice/forum/all/excel-does-not-recognize-iso-formated-date-time/92cdb33a-6799-4599-92f2-fc3549d6dd8b
const formatISOforExcel = (iso) => {
  if (iso) {
    return DateTime.fromISO(iso).toFormat('yyyy-MM-dd TT')
  }
  return '-'
}

const downloadAllHutsCsv = (picker, data) => () => {
  const csvData = sortBy(
    data.map(({ order_id, redemptions, tickets }) => {
      const woodland = redemptions.find(({ location }) => location === 'lap_fc_woodland') || { scanned_at: null }
      const lobby = redemptions.find(({ location }) => location === 'lap_fc_compass') || { scanned_at: null }
      const hut = redemptions.find(({ location }) => hut_list.includes(location)) || { location: '-', scanned_at: null }
      const complete = redemptions.find(({ location }) => location === 'lap_fc_complete') || { scanned_at: null }

      const children = tickets.filter(
        ({ ticket_type_id }) => ticket_type_id === 'tt_children_under_13',
      ).length

      return {
        order_id,
        hut_id: hut.location,
        children,
        woodland_checked_in: formatISOforExcel(woodland.scanned_at),
        lobby_checked_in: formatISOforExcel(lobby.scanned_at),
        hut_checked_in: formatISOforExcel(hut.scanned_at),
        tour_complete: formatISOforExcel(complete.scanned_at),
      }
    }), ['hut_id', 'hut_checked_in'])
    .map(details => Object.values(details).join(','))
    .reduce((acc, curr) => {
      return acc + curr + '\n'
    }, 'order_id,hut_id,children,woodland_checked_in,lobby_checked_in,hut_checked_in,tour_complete\n')

  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })

  saveAs(blob, `fc_hut_statistics_${picker}.csv`)
}

const DailyReports = () => {
  const navigate = useNavigate()
  const params = useParams()

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()

  const [
    report,
    setReport,
  ] = useState('lap_fc_hut_1')

  const [
    picker,
    setPicker,
  ] = useState(searchParams.get('picker') || DateTime.local().toISODate())

  const handleSetDate = (value) => {
    setSearchParams(`picker=${value}`)
    setPicker(value)
  }

  const {
    isFetching,
    data,
  } = useRedemptions(
    {
      locations: [report, 'lap_fc_complete'],
      from: picker,
      to: picker,
      filter: 'last',
    },
    1000 * 60 * 10,
  )

  const options = hut_settings.map(hut => {
    return {
      label: hut.title,
      value: hut.id,
    }
  })

  const dataForHut = data.filter(({ redemptions }) => {
    return redemptions.find(({ location }) => location === report)
  })

  const items = sortBy(dataForHut.map(item => {
    const {
      first_name,
      last_name,
      order_id,
      redemptions,
      start_time,
      tickets,
    } = item

    const lobby = redemptions.find(({ location }) => location === 'lap_fc_compass')
    const lobby_checked_in = DateTime.fromISO(lobby.scanned_at).toFormat('yyyy-MM-dd T')

    const found_in = redemptions.find(({ location }) => location === report)

    const hut_checked_in = DateTime.fromISO(found_in.scanned_at).toFormat('yyyy-MM-dd T')

    let checked_out = '-'

    const found_out = redemptions.find(({ location }) => location === 'lap_fc_complete')

    if (found_out) checked_out = DateTime.fromISO(found_out.scanned_at).toFormat('yyyy-MM-dd T')

    const lobby_wait_length = formatDiff(DateTime.fromISO(found_in.scanned_at).diff(DateTime.fromISO(lobby.scanned_at), 'minutes'))

    const visit_length = (found_in && found_out)
      ? formatDiff(DateTime.fromISO(found_out.scanned_at).diff(DateTime.fromISO(found_in.scanned_at), 'minutes'))
      : '-'

    const children = tickets.filter(
      ({ ticket_type_id }) => ticket_type_id === 'tt_children_under_13',
    ).length

    return {
      name: `${last_name}, ${first_name}`,
      order_id,
      tour_time: start_time.slice(0, 5),
      children,
      lobby_checked_in,
      hut_checked_in,
      checked_out,
      lobby_wait_length,
      visit_length,
      view: <ViewButton onClick={() => navigate(`/area/${params.id}/guests/${order_id}`)}>{'View'}</ViewButton>,
    }
  }), ['hut_checked_in'])

  return (
    <Container maxW={'100%'} padding={'0'}>
      <HeaderWrapper title={'FC Hut Statistics'}>
        <Search
          options={options}
          report={report}
          picker={picker}
          setReport={setReport}
          setPicker={handleSetDate}
        />
        <Box pos={'absolute'} top={'2rem'} right={'2rem'}>
          <Button
            bg={'white'}
            color={'dark-blue'}
            border={'1px solid var(--chakra-colors-dark-blue)'}
            onClick={downloadAllHutsCsv(picker, data)}
            leftIcon={<DownloadIcon />}
          >
            {'All Huts CSV'}
          </Button>
        </Box>
      </HeaderWrapper>
      <Stack direction={'column'} gap={'1rem'} padding={'2rem 2rem 10rem 2rem'}>
        <OutputBar
          data={generateStats(dataForHut)}
        />
        <OutputTable
          columns={[
            {
              label: 'Name',
              key: 'name',
            },
            {
              label: 'Order',
              key: 'order_id',
            },
            {
              label: 'Tour Time',
              key: 'tour_time',
            },
            {
              label: 'Children',
              key: 'children',
            },
            {
              label: 'Lobby Check In',
              key: 'lobby_checked_in',
            },
            {
              label: 'Allocated to Hut',
              key: 'hut_checked_in',
            },
            {
              label: 'Tour Completed',
              key: 'checked_out',
            },
            {
              label: 'Lobby Wait',
              key: 'lobby_wait_length',
            },
            {
              label: 'Hut Visit Length',
              key: 'visit_length',
            },
            {
              label: '',
              key: 'view',
            },
          ]}
          data={items}
        />
      </Stack>
      {isFetching && <Loader />}
    </Container>
  )
}

const OutputTable = ({
  columns,
  data,
}) => {
  return (
    <TableContainer>
      <Table variant={'striped'} bg={'white'} borderRadius={'1rem'}>
        <Thead>
          <Tr>
            {columns.map(({ key, label }) => {
              return (
                <Th key={key}>{label}</Th>
              )
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => {
            return (
              <Tr key={index}>
                {columns.map(({ key }, index) => {
                  return (
                    <Td key={index}>{item[key]}</Td>
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
