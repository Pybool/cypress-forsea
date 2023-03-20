import React, { useState } from 'react'

import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  HStack,
  VisuallyHidden,
  Portal,
} from '@chakra-ui/react'

import { ArrowForwardIcon } from '@chakra-ui/icons'
import HIcon from '@harmony/atoms/Icon'

import { VscFile } from 'react-icons/vsc'

import useTimeElapsed from '@harmony/hooks/useTimeElapsed'
import parseGuests from '@harmony/libs/parseGuests'
import timeElapsedColor from '@harmony/libs/timeElapsedColor'
import { OrderDetailsWrapper } from '@harmony/molecules/Drawer/OrderDetails'

import useGetOrder from '@harmony/hooks/useGetOrder'

import Loader from '@harmony/molecules/Loader'

const GuestCard = ({
  order,
  data,
  change,
  confirmed,
}) => {
  const {
    order_id,
    redemptions,
    first_name,
    last_name,
  } = order

  const [
    assigning,
    setAssigning,
  ] = useState(false)

  const { data: orderData } = useGetOrder({
    id: order_id,
  })

  const orderDetails = parseGuests(orderData)

  const { vip, wheelchair } = orderDetails

  let stamp = null

  if (redemptions.length > 0) {
    stamp = redemptions.reduce((acc, { scanned_at }) => {
      return scanned_at > acc ? scanned_at : acc
    }, redemptions[0].scanned_at)
  }

  const { elapsed } = useTimeElapsed(stamp)

  const handleAssign = async (location) => {
    setAssigning(true)
    await change(location, order)
  }

  return (
    <Box
      minWidth={'25vw'}
      bg={'white'}
      borderRadius={5}
      boxShadow={'md'}
      padding={4}
      position={'relative'}
    >
      <Box>
        <HStack justify={'space-between'}>
          <Text fontWeight={'bold'} fontSize={'xl'} textTransform={'uppercase'}>
            {`${last_name}, ${first_name}`}
          </Text>
          <Box>
            {vip && (
              <HIcon name={'MdStar'} height={4} color={'var(--harmony-brand)'} />
            )}
            {wheelchair && (
              <HIcon name={'MdAccessible'} height={4} color={'var(--harmony-brand)'} />
            )}
          </Box>
        </HStack>
        <Flex
          gap={'0.25rem'}
          alignItems={'center'}
          justifyContent={'start'}
          padding={'0'}
          fontSize={'0.75rem'}
        >
          <Icon as={VscFile} w={'0.75rem'} h={'0.75rem'} />
          <Text>{`Order ref: ${order_id}`}</Text>
        </Flex>
        <Text
          color={timeElapsedColor(elapsed)}
          fontSize={'0.875rem'}
          fontWeight={'bold'}
          marginBottom={'2rem'}
          textTransform={'uppercase'}
        >
          {`${elapsed} min wait`}
        </Text>
        <Actions data={data} change={handleAssign} />
      </Box>
      <OrderDetailsWrapper
        action={({ onOpen }) => {
          return (
            <Button
              onClick={onOpen}
              pos={'absolute'}
              top={'0'}
              bottom={'0'}
              right={'0'}
              my={'auto'}
              bg={'none'}
              _hover={{ bg: 'none' }}
              _active={{ bg: 'none' }}
            >
              <VisuallyHidden>{'See order details'}</VisuallyHidden>
              <HIcon name={'MdMoreVert'} height={6} />
            </Button>
          )
        }}
        order_id={order_id}
        elapsed={elapsed}
        confirmed={confirmed}
        allowReprint
      />
      {assigning && (
        <Loader
          height={'auto'}
          bottom={0}
        />
      )}
    </Box>
  )
}

const Actions = ({ data, change }) => {
  const filtered = data.filter((item) => !item.disabled)

  return (
    <Menu>
      <MenuButton
        as={Button}
        colorScheme={'dark-blue'}
        rightIcon={<ArrowForwardIcon />}
        variant={'link'}
      >
        {'Assign to hut'}
      </MenuButton>
      <Portal>
        <MenuList>
          {filtered.map((item) => {
            return (
              <MenuItem key={item.id} onClick={() => change(item.id)}>
                {`Move to ${item.title}`}
              </MenuItem>
            )
          })}
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default GuestCard
