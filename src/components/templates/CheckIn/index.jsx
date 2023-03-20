import React from 'react'


import { DateTime } from 'luxon'

import uniq from 'lodash/uniq'

import {
  Flex,
  Container,
  Text,
  Button,
  useDisclosure,
  Circle,
} from '@chakra-ui/react'

import { ArrowForwardIcon, CheckIcon, TimeIcon } from '@chakra-ui/icons'

import useGetOrder from '@harmony/hooks/useGetOrder'
import useTickets from '@harmony/hooks/useTickets'

import Flow from './Flow'

import parseGuests from '@harmony/libs/parseGuests'
import ChildCardPrintConfirmation from '@harmony/molecules/Drawer/ChildCardPrint'
import InformationCards from '@harmony/views/PrintPreview/InformationCards'

import hut_settings from '../QueueControl/hut_settings'

const hut_list = hut_settings.map(({ id }) => id)

const ActionGuests = ({
  label = 'Check in guests',
  change,
  isLoading,
  isDisabled = false,
}) => (
  <Button
    onClick={change}
    rightIcon={<ArrowForwardIcon />}
    bg={'dark-blue'}
    color={'white'}
    borderRadius={'0.25rem'}
    width={'50vw'}
    padding={'2rem'}
    isLoading={isLoading}
    isDisabled={isDisabled}
    _hover={{ bg: isDisabled && 'dark-blue' }}
    _active={{ bg: isDisabled && 'dark-blue' }}
  >
    {label}
  </Button>
)

const getTicketList = (ticketData, lead_info, child_info) => {
  const adult_tickets = ticketData.filter(({ ticket_type }) => ticket_type.id === 'tt_adult')
  const child_tickets = ticketData.filter(({ ticket_type }) => ticket_type.id === 'tt_children_under_13')
  const infant_tickets = ticketData.filter(({ ticket_type }) => ticket_type.id === 'tt_infant')
  const carer_tickets = ticketData.filter(({ ticket_type }) => ticket_type.id === 'tt_carer')

  const tickets = [
    ...adult_tickets.map((ticket, index) => ({
      ...ticket,
      check_in_values: {
        ticket_id: ticket.id,
        type: ticket.ticket_type.id,
        title: index === 0 ? `${lead_info.lastname}, ${lead_info.firstname}` : `Adult ${index + 1}`,
        lead: index === 0,
      },
      title: `Adult ${index + 1}${index === 0 ? `: ${lead_info.lastname}, ${lead_info.firstname}` : ''}`,
    })),
    ...carer_tickets.map((ticket, index) => ({
      ...ticket,
      check_in_values: {
        ticket_id: ticket.id,
        type: ticket.ticket_type.id,
        title: index === 0 && adult_tickets.length === 0 ? `${lead_info.lastname}, ${lead_info.firstname}` : `Carer ${index + 1}`,
        lead: index === 0 && adult_tickets.length === 0,
      },
      title: `PA ${index + 1}${adult_tickets.length === 0 ? `: ${lead_info.lastname}, ${lead_info.firstname}` : ''}`,
    })),
    ...child_tickets
      .filter((ticket, index) => child_info[index])
      .map((ticket, index) => ({
        ...ticket,
        check_in_values: {
          ticket_id: ticket.id,
          type: ticket.ticket_type.id,
          title: child_info[index].firstname,
          lead: false,
        },
        title: `Child ${index + 1}: ${child_info[index].firstname}`,
      })),
    ...infant_tickets.map((ticket, index) => ({
      ...ticket,
      check_in_values: {
        ticket_id: ticket.id,
        type: ticket.ticket_type.id,
        title: `Infant ${index + 1}`,
        lead: false,
      },
      title: `Infant ${index + 1}`,
    })),
  ]

  return tickets
}

const CheckIn = ({
  id,
  area,
  confirmed,
  allocated,
  group,
  ...rest
}) => {
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure()

  const {
    isOpen: isPrintOpen,
    onOpen: onPrintOpen,
    onClose: onPrintClose,
  } = useDisclosure()

  const {
    isFetching: orderFetching,
    data: orderData,
    updateOrderExtensions,
  } = useGetOrder({
    id,
  })

  const {
    isFetching,
    data: ticketData,
    redeem,
  } = useTickets({
    id,
  })

  const {
    lead_info,
    jingles_info,
    child_info,
  } = parseGuests(orderData)

  const { location } = area

  const redeemed = ticketData.filter((item) => item.redemptions.length > 0)

  const checkIns = uniq(redeemed
    .reduce((acc, cur) => {
      const {
        redemptions,
      } = cur

      redemptions
        .filter(({ location }) => location != null)
        .forEach(({ location }) => acc.push(location.id))

      return acc
    }, []))

  const tickets = getTicketList(ticketData, lead_info, child_info)

  const handleCompassSubmit = async () => {
    const ids = redeemed.map(({ id }) => id).join(',')

    await redeem(ids, {
      location_id: 'lap_fc_compass',
      scanned_at: new Date().toISOString(),
    })

    onPrintOpen()
  }

  const redemptions = redeemed[0] ? redeemed[0].redemptions : []

  let filtered = redemptions.filter(({ location }) => location != null && !hut_list.includes(location.id))

  if (filtered.length > 1 && area.id === 'fc') {
    filtered = filtered.slice(-1)
  }

  /*
    CHECK IN RULES (Based on location passed from area config)
    area.location != null
      - If lap_fc_woodland can only check in at woodland
      - If lap_fc_compass can only check in at compass if checked in at woodland
    area.location == null
      - Can check in using order of woodland and then compass
  */

  const canCheckIn = location == null ? (!checkIns.includes('lap_fc_woodland') || !checkIns.includes('lap_fc_compass')) : location === 'lap_fc_compass' ? checkIns.includes('lap_fc_woodland') : (!checkIns.includes('lap_fc_woodland') && !checkIns.includes('lap_fc_compass'))

  const checkInCompleted = (checkIns.includes('lap_fc_woodland') && checkIns.includes('lap_fc_compass'))

  if (!allocated) {
    return (
      <Container
        padding={'3rem 0'}
        bg={'white'}
        maxWidth={'100%'}
        marginTop={'1.5rem'}
        boxShadow={'dark-lg'}
        centerContent
        {...rest}
      >
        <Flex
          fontSize={'1rem'}
          gap={'0.5rem'}
          alignItems={'center'}
        >
          <Text as={'span'} textTransform={'uppercase'} fontSize={'1.25rem'} fontWeight={'bold'}>
            {'Not allocated a tour yet. Please allocate to a tour to enable check in.'}
          </Text>
        </Flex>
      </Container>
    )
  }

  return (
    <>
      <Container
        padding={'3rem 0'}
        bg={'white'}
        maxWidth={'100%'}
        marginTop={'1.5rem'}
        boxShadow={'dark-lg'}
        centerContent
        {...rest}
      >
        <CheckInWrapper
          data={filtered}
        />
        {canCheckIn && !checkInCompleted && (
          <ActionGuests
            change={checkIns.includes('lap_fc_woodland') ? handleCompassSubmit : onOpen}
            label={checkIns.includes('lap_fc_woodland') ? 'Check in at Compass Lobby ' : 'Check in at Woodland Lobby'}
            isLoading={isFetching || orderFetching}
            isDisabled={location === 'lap_fc_compass' && redeemed.length < 1}
          />
        )}
        {!canCheckIn && location === 'lap_fc_compass' && !checkInCompleted && (
          <Flex
            fontSize={'1rem'}
            gap={'0.5rem'}
            alignItems={'center'}
          >
            <Text as={'span'} textTransform={'uppercase'} fontSize={'1.25rem'} fontWeight={'bold'}>
              {'Not checked in at arrivals yet'}
            </Text>
            <Text as={'span'}>
              {'Speak to your manager'}
            </Text>
          </Flex>
        )}
      </Container>
      <Flow
        area={area}
        lead={lead_info}
        order={orderData}
        tickets={tickets}
        redeem={redeem}
        jingles={jingles_info}
        updateOrderExtensions={updateOrderExtensions}
        isOpen={isOpen}
        onClose={onClose}
        location={location || (checkIns.includes('lap_fc_woodland') ? 'lap_fc_compass' : 'lap_fc_woodland')}
        isLoading={isFetching || orderFetching}
        group={group}
      />
      <ChildCardPrintConfirmation
        title={'Check in successful'}
        color={area.color}
        isOpen={isPrintOpen}
        confirmed={confirmed}
        id={id}
        onClose={onPrintClose}
      >
        <InformationCards orderRef={id} isPreview />
      </ChildCardPrintConfirmation>
    </>
  )
}

const CheckInWrapper = ({
  data,
}) => {
  return (
    <>
      {data.map(({ location, user_email, scanned_at }, index) => {
        return (
          <CheckInInfo
            key={index}
            location={location.title}
            scanned={scanned_at}
            user={user_email}
          />
        )
      })}
    </>
  )
}

const CheckInInfo = ({
  location,
  scanned,
  user,
}) => {
  return (
    <Container maxWidth={'100%'} marginBottom={'1rem'} centerContent>
      <Flex justifyContent={'space-between'} alignItems={'center'} gap={'0.5rem'}>
        <Flex alignItems={'center'} gap={'0.5rem'}>
          <Circle
            width={'2.5rem'}
            height={'2.5rem'}
            color={'white'}
            bg={'success'}
          >
            <CheckIcon w={'1rem'} h={'1rem'} />
          </Circle>
          <Text
            textTransform={'uppercase'}
            fontSize={'1rem'}
            fontWeight={'bold'}
          >
            {`Checked in at ${location}`}
          </Text>
        </Flex>
        <Flex justifyContent={'space-between'} gap={'1rem'}>
          <Flex color={'dark-blue'} alignItems={'center'} gap={'0.5rem'}>
            <TimeIcon />
            <Text>{`${DateTime.fromISO(scanned).toFormat('ccc dd LLL')} at ${DateTime.fromISO(scanned).toFormat('T')}`}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Text>{`by ${user}`}</Text>
    </Container>
  )
}

export default CheckIn
