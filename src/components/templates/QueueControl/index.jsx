import React, { useState } from 'react'

import sortBy from 'lodash/sortBy'

import { DateTime } from 'luxon'

import {
  Heading,
  Text,
  Box,
  Container,
  Flex,
  SimpleGrid,
  Button,
} from '@chakra-ui/react'

import { RepeatIcon } from '@chakra-ui/icons'

import useRedemptions, { useRedeem } from '@harmony/hooks/useRedemptions'

import GuestCard from './GuestCard'
import HutCard from './HutCard'
import Settings from './Settings'

import hut_settings from './hut_settings'

import getSearchParams from '@harmony/libs/getSearchParams'

import { storageManager } from '@harmony/libs/storage'

const storage = storageManager()

const mergeHuts = (state, persist) => {
  return state.map(hut => {
    const persisted = persist.find(({ id }) => id === hut.id)

    return persisted ? persisted : hut
  })
}

const QueueControl = () => {
  const [
    confirmed,
  ] = useState([])

  const {
    date = DateTime.local().toISODate(),
  } = getSearchParams()

  const hut_persist = storage.get('hut_settings', [])

  const [removed, setRemoved] = useState([])

  const [huts, setHuts] = useState(mergeHuts(hut_settings, hut_persist))

  const hut_list = hut_settings.map(({ id }) => id)

  const { redeem, unRedeem } = useRedeem()

  const {
    isFetching,
    data: redemptions,
    refresh,
  } = useRedemptions({
    locations: ['lap_fc_compass', ...hut_list, 'lap_fc_complete'],
    from: date,
    to: date,
    filter: 'last',
  }, 1000 * 30)

  const tour_completed = redemptions
    .filter(({ redemptions }) => redemptions.some(({ location }) => location === 'lap_fc_complete'))
    .map(({ order_id }) => order_id)

  const inHut = redemptions
    .filter(({ redemptions }) => redemptions.some(({ location }) => hut_list.includes(location)))
    .filter(({ order_id }) => !removed.includes(order_id) && !tour_completed.includes(order_id))

  const inLobby = sortBy(redemptions
    .filter(({ redemptions }) => redemptions.every(({ location }) => !hut_list.includes(location)))
    .filter(({ order_id }) => !removed.includes(order_id) && !tour_completed.includes(order_id))
    .map(item => {
      const compass_stamp = item.redemptions.find(({ location }) => location === 'lap_fc_compass')

      return {
        ...item,
        compass_stamp: compass_stamp ? compass_stamp.scanned_at : null,
      }
    }), ['compass_stamp'])

  const hutMap = inHut.reduce((acc, cur) => {
    const hasHut = cur.redemptions.find(({ location }) =>
      hut_list.includes(location),
    )

    if (hasHut) {
      acc[hasHut.location] = {
        ...cur,
        stamp: hasHut.scanned_at,
      }
    }

    return acc
  }, {})

  const mappedHuts = huts.map((hut) => {
    return {
      ...hut,
      occupied: hutMap[hut.id] ? hutMap[hut.id] : null,
    }
  })

  const handleSettings = (payload) => {
    storage.set('hut_settings', payload)

    setHuts(payload)
  }

  const handleDisableHut = (index) => (value) => {
    const state = [...huts]

    state[index].disabled = value

    storage.set('hut_settings', state)

    setHuts(state)
  }

  const handleFinishState = (order_id) => {
    const state = [...removed]

    state.push(order_id)

    setRemoved(state)
  }

  const handleAssign = async (location, redemption = {}) => {
    const { ticket_ids, tickets } = redemption

    let ids = []

    if (ticket_ids) ids = ticket_ids.join(',')

    if (tickets) ids = tickets.map(({ ticket_id }) => ticket_id).join(',')

    const target = mappedHuts.find(({ id }) => id === location)

    if (target.occupied) {
      await handleComplete('lap_fc_complete', target.occupied)

      handleFinishState(target.occupied.order_id)
    }

    await redeem(ids, {
      location_id: location,
      scanned_at: new Date().toISOString(), // '2022-11-30T13:30:13.182Z',
    })
  }

  const handleComplete = async (location, redemption = {}) => {
    const { ticket_ids, tickets } = redemption

    let ids = []

    if (ticket_ids) ids = ticket_ids.join(',')

    if (tickets) ids = tickets.map(({ ticket_id }) => ticket_id).join(',')

    await redeem(ids, {
      location_id: location,
      scanned_at: new Date().toISOString(), // '2022-11-30T13:30:13.182Z',
    })
  }

  const handleRemove = async (location, redemption) => {
    const { ticket_ids, tickets } = redemption

    let ids = []

    if (ticket_ids) ids = ticket_ids.join(',')

    if (tickets) ids = tickets.map(({ ticket_id }) => ticket_id).join(',')

    await unRedeem(ids, location)
  }

  return (
    <Container
      maxWidth={'100%'}
      overflow={'hidden'}
      padding={'3rem 0'}
      position={'relative'}
    >
      <Container centerContent width={'100%'}>
        <Heading as={'h2'}>{'FC Queue Management'}</Heading>
      </Container>
      <Flex
        alignItems="center"
        margin={'2rem 0 1rem 0'}
        justifyContent={'center'}
      >
        <Text fontWeight={'bold'} fontSize={'1.25rem'}>
          {`${inLobby.length} groups in lobby`}
        </Text>
        <Box position={'absolute'} right={'1rem'}>
          <Settings
            display={'block'}
            marginBottom={'0.5rem'}
            data={huts}
            submit={handleSettings}
          />
          <Button
            bg={'white'}
            color={'failure'}
            border={'1px solid var(--chakra-colors-failure)'}
            onClick={refresh}
            leftIcon={<RepeatIcon />}
            isLoading={isFetching}
          >
            {'Refresh'}
          </Button>
        </Box>
      </Flex>
      <Box paddingLeft={'3rem'}>
        <Flex padding={'1rem 0'} gap={'1rem'} overflowX={'scroll'} overflowY={'hidden'}>
          {inLobby.map((order) => (
            <GuestCard
              key={order.order_id}
              order={order}
              data={huts}
              change={handleAssign}
              confirmed={confirmed}
            />
          ))}
        </Flex>
      </Box>
      <SimpleGrid columns={4} gap={'1rem'} padding={'2rem 2rem'}>
        {mappedHuts.map((hut, index) => (
          <HutCard
            key={hut.id}
            data={hut}
            toggle={handleDisableHut(index)}
            change={handleRemove}
            complete={handleComplete}
          />
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default QueueControl
