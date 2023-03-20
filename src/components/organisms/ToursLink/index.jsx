import React, { useState } from 'react'

import uniq from 'lodash/uniq'

import { Container, SimpleGrid } from '@chakra-ui/react'

import {
  TourDetails,
  TourHeader,
  TourItem,
  TourItemHandle,
  TourList,
  TourWrapper,
  TourCheckbox,
} from '@harmony/molecules/TourGroup'
import TourLinkConfirmation from '@harmony/molecules/Drawer/TourLink'
import { totalGroupQuantity } from '@harmony/libs/totals'
import { groupOrdersByExtensionGroup } from '@harmony/libs/groupOrders'
import useLinks from '@harmony/hooks/useLinks'

import { difference, isIntersection } from '@harmony/libs/sets'

import Loader from '@harmony/molecules/Loader'

const linkBody = (links) => ({
  order_ids: uniq(links).map((link) => ({ order_id: link })),
})

const ToursLink = ({
  area,
  orders,
  updateOrders,
  isFetching,
}) => {
  const [
    activeOrder,
    setActiveOrder,
  ] = useState(undefined)

  const [
    newLinks,
    setNewLinks,
  ] = useState([])

  const {
    isLoading,
    setLinks,
    unsetLinks,
  } = useLinks()

  // computed values
  const [
    huskies,
    reindeers,
  ] = groupOrdersByExtensionGroup(orders)

  const current = uniq([activeOrder?.links].flat().filter(Boolean))
  const added = difference(newLinks, current)
  const removed = difference(current, newLinks)

  const activate = (order) => (event) => {
    const { links } = order

    if (activeOrder === undefined) {
      event.preventDefault()
      setActiveOrder(order)
      setNewLinks(uniq(links))
    }
  }

  const toggleLinked = (order) => () => {
    const { orderRef, links = [] } = order

    // remove
    if (newLinks.includes(orderRef)) {
      return setNewLinks(difference(newLinks, [orderRef]))
    }

    // add
    setNewLinks(uniq([...newLinks, ...links, orderRef]))
  }

  const reset = () => {
    setActiveOrder(undefined)
    setNewLinks([])
  }

  const onConfirm = async () => {
    for (const order of orders) {
      const {
        links,
        orderRef,
      } = order

      if (orderRef === activeOrder.orderRef) {
        // added
        if (added.length > 0) {
          await setLinks(orderRef, linkBody(added))
        }

        // removed
        if (removed.length > 0) {
          await unsetLinks(orderRef, linkBody(removed))
        }

        return
      }

      // orphaned
      if (isIntersection(links, newLinks) && !newLinks.includes(orderRef)) {
        await unsetLinks(orderRef, linkBody(links))
      }
    }

    await updateOrders()
    reset()
  }

  const renderTourItem = (type) => (order) => {
    const { orderRef } = order

    const isActive = activeOrder?.orderRef === orderRef

    return (
      <TourItem
        as={'label'}
        key={orderRef}
        id={orderRef}
        order={order}
        orders={orders}
        type={type}
        handle={
          <TourItemHandle>
            <TourCheckbox
              enabled={activeOrder}
              onChange={toggleLinked(order)}
              isChecked={isActive || newLinks.includes(orderRef)}
              readOnly={isActive}
            />
          </TourItemHandle>
        }
        cursor={isActive ? 'initial' : 'pointer'}
        onClick={activate(order)}
        active={isActive}
      />
    )
  }

  return (
    <>
      {(huskies.length > 0 || reindeers.length > 0) && (
        <Container centerContent maxW={'4xl'} paddingBottom={'21.25vh'} position={'relative'}>
          <SimpleGrid columns={2} width={'100%'} columnGap={6}>
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
              <TourList data-testid={'huskies'} accepts={'reindeers'}>
                {huskies.map(renderTourItem('huskies'))}
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
              <TourList data-testid={'reindeers'} accepts={'huskies'}>
                {reindeers.map(renderTourItem('reindeers'))}
              </TourList>
            </TourWrapper>
          </SimpleGrid>
          {(isFetching || isLoading) && (
            <Loader position={'fixed'} />
          )}
        </Container>
      )}
      <TourLinkConfirmation
        isOpen={activeOrder}
        color={area.color}
        activeOrder={activeOrder}
        orders={orders}
        newLinks={newLinks}
        onClose={reset}
        onConfirm={onConfirm}
      />
    </>
  )
}

export default ToursLink
