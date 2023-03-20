import React, { useState } from 'react'

import {
  Container,
  SimpleGrid,
} from '@chakra-ui/react'

import {
  TourDetails,
  TourHeader,
  TourDraggableItem,
  TourWrapper,
  TourList,
} from '@harmony/molecules/TourGroup'

import TourSortConfirmation from '@harmony/molecules/Drawer/TourSort'
import useSetExtensions from '@harmony/hooks/useSetExtensions'
import { totalGroupQuantity } from '@harmony/libs/totals'
import { groupOrdersByExtensionGroup } from '@harmony/libs/groupOrders'

import Loader from '@harmony/molecules/Loader'

const ToursSort = ({
  area,
  orders,
  updateOrders,
  selected,
  isFetching,
}) => {
  const [
    huskies,
    reindeers,
  ] = groupOrdersByExtensionGroup(orders)

  const {
    isLoading,
    setExtensions,
  } = useSetExtensions()

  const [
    confirm,
    setConfirm,
  ] = useState(undefined)

  const handleSwitchColumn = (payload) => {
    setConfirm({
      ...payload.order,
      newGroup: payload.type === 'huskies' ? 'reindeers' : 'huskies',
    })
  }

  const onConfirm = (payload) => {
    const { orderRef, newGroup, links } = payload

    updateOrders()

    const confirmedItems = [orderRef, ...links]
    confirmedItems.forEach((ref) => {
      setExtensions({
        id: ref,
        extensions: { group: newGroup },
      })
    })
  }

  return (
    <>
      {(huskies.length > 0 || reindeers.length > 0) && (
        <Container centerContent maxW={'4xl'} position={'relative'}>
          <SimpleGrid
            columns={2}
            width={'100%'}
            columnGap={'1.5rem'}
          >
            <TourWrapper
              header={<TourHeader title={'Huskies'} />}
              details={
                <TourDetails
                  counts={{
                    groups: huskies.length,
                    adults: totalGroupQuantity(huskies, 'adults'),
                    children: totalGroupQuantity(huskies, 'children'),
                  }}
                  labels={{
                    groups: 'No of Groups',
                    adults: 'Adults',
                    children: 'Children',
                  }}
                />
              }
            >
              <TourList id={'huskies'}>
                {huskies.map(({ id, ...props }) => (
                  <TourDraggableItem
                    key={id}
                    id={id}
                    order={props}
                    orders={orders}
                    type={'huskies'}
                    selected={selected}
                    change={handleSwitchColumn}
                  />
                ))}
              </TourList>
            </TourWrapper>
            <TourWrapper
              header={<TourHeader title={'Reindeers'} />}
              details={
                <TourDetails
                  counts={{
                    groups: reindeers.length,
                    adults: totalGroupQuantity(reindeers, 'adults'),
                    children: totalGroupQuantity(reindeers, 'children'),
                  }}
                  labels={{
                    groups: 'No of Groups',
                    adults: 'Adults',
                    children: 'Children',
                  }}
                />
              }
            >
              <TourList id={'reindeers'}>
                {reindeers.map(({ id, ...props }) => (
                  <TourDraggableItem
                    key={id}
                    id={id}
                    order={props}
                    orders={orders}
                    type={'reindeers'}
                    selected={selected}
                    change={handleSwitchColumn}
                  />
                ))}
              </TourList>
            </TourWrapper>
          </SimpleGrid>
          {(isFetching || isLoading) && (
            <Loader position={'fixed'} />
          )}
        </Container>
      )}
      <TourSortConfirmation
        isOpen={confirm}
        color={area.color}
        data={confirm}
        onClose={() => {
          setConfirm(undefined)
        }}
        onConfirm={onConfirm}
      />
    </>
  )
}

export default ToursSort
