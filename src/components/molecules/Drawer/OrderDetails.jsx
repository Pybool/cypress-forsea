import { Fragment, useState, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { DateTime } from 'luxon'

import {
  Heading,
  Box,
  Flex,
  HStack,
  Text,
  Divider,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'

import noop from '@harmony/libs/noop'
import areasConfig from '@harmony/config'
import useTickets from '@harmony/hooks/useTickets'
import useGetOrder from '@harmony/hooks/useGetOrder'

import { ContentDrawer as Drawer } from '@harmony/atoms/Drawer'
import ActionButton from '@harmony/atoms/Button/Action'
import Icon from '@harmony/atoms/Icon'
import OutlinedBadge from '@harmony/atoms/Badge/outlined'
import timeElapsedColor from '@harmony/libs/timeElapsedColor'

import parseGuests from '@harmony/libs/parseGuests'
import { getInternalRoleInfo } from '@harmony/libs/permissionHelpers'

import { JourneyItem, getCompassWaitMessage } from '@harmony/templates/GuestManagement/Journey'

const Count = ({
  label = '',
  value = 0,
}) => (
  <Flex direction={'column'}>
    <Text
      as={'span'}
      color={'var(--harmony-brand)'}
      fontSize={'xl'}
      fontWeight={'extrabold'}
      lineHeight={1}
      mb={3}
    >
      {label}
    </Text>
    <Text
      as={'span'}
      fontSize={'3xl'}
      fontWeight={'extrabold'}
      lineHeight={1}
    >
      {value}
    </Text>
  </Flex>
)

const FCOrderDetails = ({
  isOpen = true,
  onClose = noop,
  order_id,
  elapsed = null,
  allowReprint = false,
  leaveOnSuccess = false,
}) => {
  const navigate = useNavigate()

  const [
    printing,
    setPrinting,
  ] = useState(null)

  const [
    printFail,
    setFail,
  ] = useState(false)

  const {
    id: areaId,
  } = useParams()

  const {
    color,
  } = areasConfig[areaId]

  const handlePrint = (payload) => {
    setFail(false)

    setPrinting(payload)

    const { path, queue } = payload

    window.open(`${path}?queue=${queue}`, '_blank')
  }

  const handleClose = () => {
    setFail(false)

    setPrinting(null)

    onClose()
  }

  useEffect(() => {
    if (printing != null) {
      setPrinting(null)
      leaveOnSuccess && navigate(`/area/${areaId}/guests`)
    }
  })

  return (
    <Drawer
      sx={{ '--harmony-brand': color }}
      isOpen={isOpen}
      onClose={handleClose}
      overflow={'visible'}
    >
      {isOpen && (
        <DetailsBody
          order_id={order_id}
          elapsed={elapsed}
          allowReprint={allowReprint}
          handlePrint={handlePrint}
          printing={printing}
          printFail={printFail}
        />
      )}
    </Drawer>
  )
}

const DetailsBody = ({
  order_id,
  elapsed,
  allowReprint,
  handlePrint,
  printing,
  printFail,
}) => {
  const [
    cancelling,
    setCancelling,
  ] = useState(false)

  const {
    data: order,
    updateOrderExtensions,
    forceRefresh,
  } = useGetOrder({
    id: order_id,
  })

  const {
    data: tickets,
    unRedeem,
  } = useTickets({
    id: order_id,
  })

  const {
    lead_info,
    vip,
    wheelchair,
    isLinked,
    linked_orders,
    showDay,
    showTime,
    adult_tickets,
    child_tickets,
    infant_tickets,
    carer_tickets,
  } = parseGuests(order)

  const redeemed = tickets.filter((ticket) => ticket.redemptions.length > 0)

  const {
    redemptions: checkpoints = [],
  } = redeemed.at(0) || {}

  const handleUnRedeem = async () => {
    setCancelling(true)

    const locations = checkpoints.filter(({ location }) => location != null).map(({ location }) => location.id)

    const location_id = locations[locations.length - 1]

    if (location_id != null) {
      const ids = redeemed
        .reduce((acc, cur) => {
          const filtered = cur.redemptions.filter(({ location }) => location != null)

          if (filtered.some((item) => item.location.id === location_id)) {
            acc.push(cur.id)
          }

          return acc
        }, [])
        .join(',')

      if (ids.length > 0) {
        await unRedeem(ids, location_id)
      }

      if (location_id === 'lap_fc_woodland') {
        await updateOrderExtensions(order_id, { checked_in: [] })
      }
    }

    forceRefresh()

    setCancelling(false)

    onClose()
  }

  const role = getInternalRoleInfo()

  let guests = ''

  if (order?.extensions.checked_in && Array.isArray(order?.extensions.checked_in)) {
    guests = `Checked in Guests: ${order.extensions.checked_in
      .map((item) => `${item.title} ${item.lead ? '(Lead)' : ''}`)
      .join(' | ')}`
  }

  const filtered = checkpoints.filter(({ location }) => location != null)

  return (
    <>
      <Flex justifyContent={'space-between'}>
        <HStack spacing={3}>
          {vip && (
            <OutlinedBadge icon={'MdStar'}>{'VIP'}</OutlinedBadge>
          )}
          {wheelchair && (
            <OutlinedBadge icon={'MdAccessible'}>{'Wheelchair'}</OutlinedBadge>
          )}
        </HStack>
        {isLinked && (
          <HStack spacing={2} ml={'auto'}>
            {linked_orders.map(({ order_id }, index) => (
              <Fragment key={index}>
                <Icon
                  name={'MdLink'}
                  height={5}
                  transform={'rotateZ(-45deg)'}
                />
                <Text>
                  {order_id}
                </Text>
              </Fragment>
            ))}
          </HStack>
        )}
      </Flex>
      <Box my={'1rem'}>
        <Heading as={'h2'} size={'xl'} textAlign={'center'} w={'100%'}>
          {`${lead_info?.lastname}, ${lead_info?.firstname}`}
        </Heading>
        <HStack spacing={1} w={'max-content'} mx={'auto'}>
          <Icon name={'MdOutlineInsertDriveFile'} height={6} />
          <Box as={'span'} fontWeight={'normal'} fontSize={'md'}>
            <Box as={'strong'} fontWeight={'bold'}>
              {'Order ref:'}
            </Box>
            {` ${order_id}`}
          </Box>
        </HStack>
      </Box>
      <Flex direction={'column'} align={'center'} justify={'center'}>
        {elapsed != null && (
          <Box
            color={timeElapsedColor(elapsed)}
            bg={'grey4'}
            borderRadius={8}
            px={48}
            py={6}
            height={20}
            w={'max-content'}
            fontWeight={'extrabold'}
            fontSize={'3xl'}
            lineHeight={1}
            textAlign={'center'}
            textTransform={'uppercase'}
          >
            {`${elapsed} min wait`}
          </Box>
        )}
        <Box borderY={'1px solid'} borderColor={'grey3'} p={3} my={7}>
          {showDay && (
            <HStack h={16} spacing={4}>
              <Text
                as={'time'}
                dateTime={showDay}
                noOfLines={2}
                fontSize={'2xl'}
                fontWeight={'extrabold'}
              >
                {DateTime.fromISO(showDay).toFormat('ccc dd LLL')}
                <br />
                {DateTime.fromISO(showTime).toFormat('h:mma')}
              </Text>
              <Divider orientation={'vertical'} />
              <Count
                label={'Adults'}
                value={adult_tickets ? adult_tickets.reduce((acc, { qty }) => acc + qty, 0) : 0}
              />
              <Divider orientation={'vertical'} />
              <Count
                label={'Children'}
                value={child_tickets ? child_tickets.reduce((acc, { qty }) => acc + qty, 0) : 0}
              />
              <Divider orientation={'vertical'} />
              <Count
                label={'Infants'}
                value={infant_tickets ? infant_tickets.reduce((acc, { qty }) => acc + qty, 0) : 0}
              />
              <Divider orientation={'vertical'} />
              <Count
                label={'P. Assistants'}
                value={carer_tickets ? carer_tickets.reduce((acc, { qty }) => acc + qty, 0) : 0}
              />
            </HStack>
          )}
        </Box>
        <Text>{guests}</Text>
        <VStack mt={'1.5rem'} align={'stretch'} spacing={'1rem'} width={'70vw'}>
          {filtered.map((checkpoint, index) => (
            <JourneyItem
              key={index}
              elapsed={getCompassWaitMessage(checkpoint, filtered)}
              {...checkpoint}
            />
          ))}
        </VStack>
      </Flex>
      <VStack mx={'auto'} align={'center'} spacing={2}>
        {role === 'management' && (
          <ActionButton
            rightIcon={<Icon name={'MdOutlineDoNotDisturbOn'} height={8} />}
            onClick={() => {
              handleUnRedeem()
            }}
            w={'max-content'}
            color={'failure'}
            bg={'none'}
            fontWeight={'bold'}
            _hover={{ bg: 'none' }}
            isLoading={cancelling}
          >
            {'Cancel last check in'}
          </ActionButton>
        )}
        {allowReprint && (
          <>
            {printFail && (
              <Text fontWeight={'bold'} color={'failure'}>{'Print request failed, please check the printer.'}</Text>
            )}
            <Flex
              direction={['column', 'column', 'column', 'row']}
              justifyContent={'space-between'}
              gap={'1rem'}
            >
              <ActionButton
                disabled={printing != null}
                leftIcon={<Icon name={'MdPrint'} height={8} />}
                onClick={() =>
                  handlePrint({
                    action: 'print',
                    queue: 'a',
                    path: `/print/child-cards/${order_id}`,
                    type: 'child-cards',
                    ref: order_id,
                    stamp: Date.now(),
                  })
                }
                w={'max-content'}
                fontSize={'2rem'}
                isLoading={printing != null}
              >
                {'Reprint card at queue A'}
              </ActionButton>
              <ActionButton
                disabled={printing != null}
                leftIcon={<Icon name={'MdPrint'} height={8} />}
                onClick={() =>
                  handlePrint({
                    action: 'print',
                    queue: 'b',
                    path: `/print/child-cards/${order_id}`,
                    type: 'child-cards',
                    ref: order_id,
                    stamp: Date.now(),
                  })
                }
                w={'max-content'}
                fontSize={'2rem'}
                isLoading={printing != null}
              >
                {'Reprint card at queue B'}
              </ActionButton>
            </Flex>
          </>
        )}
      </VStack>
    </>
  )
}

const OrderDetailsWrapper = ({ action, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {action({ onOpen })}
      <FCOrderDetails isOpen={isOpen} onClose={onClose} {...rest} />
    </>
  )
}

export default FCOrderDetails

export { OrderDetailsWrapper }
