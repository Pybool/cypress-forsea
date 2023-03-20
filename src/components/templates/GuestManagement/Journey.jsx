import React, { useCallback } from 'react'

import { DateTime } from 'luxon'

import {
  Box,
  Container,
  Heading,
  Flex,
  VStack,
  Text,
  Circle,
  Button,
} from '@chakra-ui/react'

import { CheckIcon, TimeIcon, CloseIcon } from '@chakra-ui/icons'

import useTickets from '@harmony/hooks/useTickets'
import useGetOrder from '@harmony/hooks/useGetOrder'

import { OrderDetailsWrapper } from '@harmony/molecules/Drawer/OrderDetails'
import { useParams } from 'react-router-dom'

import hut_settings from '../QueueControl/hut_settings'

const hut_list = hut_settings.map(({ id }) => id)

const ActionDetails = ({ change, children }) => {
  return (
    <Button
      onClick={change}
      bg={'transparent'}
      border={'2px solid var(--chakra-colors-dark-blue)'}
      height={'5rem'}
      borderRadius={'2.5rem'}
      fontSize={'1.25rem'}
      padding={'0 2.5rem'}
      margin={'0 auto'}
    >
      {children}
    </Button>
  )
}

const showDelete = false // Set to hide the delete button. When true you can test individual unredeems

const reprint_areas = [
  'compass',
  'guest',
  'fc',
  'management',
]

const getCompassWait = (redemptions) => {
  let value = null

  const has_hut = redemptions.some(({ location }) => hut_list.includes(location.id))

  if (has_hut) {
    const compass = redemptions.find(({ location }) => location.id === 'lap_fc_compass')

    const hut = redemptions.find(({ location }) => hut_list.includes(location.id))

    if (compass && hut) {
      const diff = DateTime.fromISO(hut.scanned_at).diff(DateTime.fromISO(compass.scanned_at),  'minutes')

      value = diff.toObject().minutes
    }
  }

  return value
}

const getCompassWaitMessage = (checkpoint, redemptions) => {
  let elapsed_message = null

  const elapsed = getCompassWait(redemptions)

  if (checkpoint.location.id === 'lap_fc_compass' && elapsed != null) {
    elapsed_message = `They waited ${elapsed} minutes at ${checkpoint.location.title}`
  }

  return elapsed_message
}

const Journey = ({
  id,
  role,
  sendMessage,
  confirmed,
  first,
  last,
}) => {
  const handleSendMessage = useCallback((message) => {
    sendMessage(message)
  })

  const { id: areaId } = useParams()

  const { data: orderData } = useGetOrder({
    id,
  })

  const { data, unRedeem } = useTickets({
    id,
  })

  const redeemed = data.filter((item) => item.redemptions.length > 0)

  if (redeemed.length === 0) return null

  const redemptions = redeemed[0].redemptions
    .filter(({ location }) => location != null)

  const handleUnRedeem = async (location) => {
    const ids = redeemed
      .reduce((acc, cur) => {
        if (cur.redemptions.some((item) => item.location.id === location)) {
          acc.push(cur.id)
        }

        return acc
      }, [])
      .join(',')

    await unRedeem(ids, location)
  }

  return (
    <Box padding={'3rem 4rem 0 4rem'}>
      <Container centerContent marginBottom={'2rem'}>
        <Heading as={'h2'}>{'Customer journey'}</Heading>
      </Container>
      <VStack
        spacing={'1rem'}
        width={'100%'}
        align={'stretch'}
        marginBottom={'1rem'}
      >
        {first && first()}
        {redemptions.map((checkpoint, index) => {
          const { checked_in } = orderData.extensions

          let guests = ''

          if (checked_in && Array.isArray(checked_in)) {
            guests = `Checked in Guests: ${checked_in
              .map((item) => `${item.title} ${item.lead ? '(Lead)' : ''}`)
              .join(' | ')}`
          }

          return (
            <JourneyItem
              key={index}
              guests={guests}
              elapsed={getCompassWaitMessage(checkpoint, redemptions)}
              action={() => {
                return (
                  <>
                    {role === 'management' && showDelete && (
                      <Button
                        colorScheme={'red'}
                        leftIcon={<CloseIcon />}
                        variant={'link'}
                        onClick={() => handleUnRedeem(checkpoint.location.id)}
                        marginTop={'1rem'}
                      >
                        {'Delete'}
                      </Button>
                    )}
                  </>
                )
              }}
              {...checkpoint}
            />
          )
        })}
        {last && last()}
      </VStack>
      {!reprint_areas.includes(areaId) && (
        <OrderDetailsWrapper
          confirmed={confirmed}
          action={({ onOpen }) => {
            return (
              <Container centerContent marginTop={'2rem'}>
                <ActionDetails change={onOpen}>
                  {'Cancel check in'}
                </ActionDetails>
              </Container>
            )
          }}
          order_id={orderData.id}
          sendMessage={handleSendMessage}
        />
      )}
      {reprint_areas.includes(areaId) && (
        <OrderDetailsWrapper
          confirmed={confirmed}
          action={({ onOpen }) => {
            return (
              <Container centerContent marginTop={'2rem'}>
                <ActionDetails change={onOpen}>
                  {'Reprint card or cancel check in'}
                </ActionDetails>
              </Container>
            )
          }}
          order_id={orderData.id}
          sendMessage={handleSendMessage}
          leaveOnSuccess
          allowReprint
        />
      )}
    </Box>
  )
}

const JourneyItem = ({
  scanned_at,
  location,
  user_email,
  guests = null,
  action = () => null,
  elapsed,
}) => {
  return (
    <Flex justifyContent={'space-between'}>
      <Flex gap={'0.5rem'}>
        <Circle
          width={'2.75rem'}
          height={'2.75rem'}
          color={'white'}
          bg={'success'}
          marginBottom={'1rem'}
        >
          <CheckIcon w={'1rem'} h={'1rem'} />
        </Circle>
        <Box>
          <Text fontWeight={'bold'} fontSize={'1.25rem'}>
            {location.title}
          </Text>
          <Text>
            {'by '}
            <Text as={'span'} color={'brand.woodland'}>
              {user_email}
            </Text>
          </Text>
          {elapsed && (
            <Text fontWeight={'bold'} marginTop={'0.5rem'}>{elapsed}</Text>
          )}
          {guests && (
            <Text marginTop={'0.5rem'}>{guests}</Text>
          )}
        </Box>
      </Flex>
      <Box>
        <Flex color={'grey2'} alignItems={'center'} gap={'0.5rem'}>
          <TimeIcon />
          <Text>{`${DateTime.fromISO(scanned_at).toFormat('ccc dd LLL')} at ${DateTime.fromISO(scanned_at).toFormat('T')}`}</Text>
        </Flex>
        {action()}
      </Box>
    </Flex>
  )
}

const MiscItem = ({
  scanned_at,
  location,
  guests = null,
  action = () => null,
  elapsed,
}) => {
  return (
    <Flex justifyContent={'space-between'}>
      <Flex gap={'0.5rem'}>
        <Circle
          width={'2.75rem'}
          height={'2.75rem'}
          color={'white'}
          bg={'success'}
          marginBottom={'1rem'}
        >
          <CheckIcon w={'1rem'} h={'1rem'} />
        </Circle>
        <Box>
          <Text fontWeight={'bold'} fontSize={'1.25rem'}>
            {location.title}
          </Text>
          {elapsed && (
            <Text fontWeight={'bold'} marginTop={'0.5rem'}>{elapsed}</Text>
          )}
          {guests && (
            <Text marginTop={'0.5rem'}>{guests}</Text>
          )}
        </Box>
      </Flex>
      <Box>
        <Flex color={'grey2'} alignItems={'center'} gap={'0.5rem'}>
          <TimeIcon />
          <Text>{`${DateTime.fromISO(scanned_at).toFormat('ccc dd LLL')} at ${DateTime.fromISO(scanned_at).toFormat('T')}`}</Text>
        </Flex>
        {action()}
      </Box>
    </Flex>
  )
}

export default Journey

export {
  JourneyItem,
  getCompassWaitMessage,
  MiscItem,
}
