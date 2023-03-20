import React, { useEffect } from 'react'

import chunk from 'lodash/chunk'

import { useParams } from 'react-router-dom'

import ChildCards from '@harmony/organisms/ChildCards'

import useGetOrder from '@harmony/hooks/useGetOrder'

const InfoCards = ({
  isFetching = false,
  isError = false,
  noData = false,
  noId = false,
  data = [],
  isPreview = false,
}) => (
  <>
    {noId && 'No order ID has been chosen. Please may you choose one?'}
    {isFetching && 'Getting the Child cards...'}
    {isError}
    {!isError && !isFetching && !noId && noData && 'There\'s no one here today'}
    {!isError && !isFetching && !noId && !noData && (
      <ChildCards isPreview={isPreview} data={data} />
    )}
  </>
)

const decorate = ({
  customer,
  customers,
  items,
  extensions,
}) => {
  const {
    firstname,
    lastname,
  } = customer

  const {
    addons,
    ticket_types,
  } = items[0]

  const {
    is_vip,
    checked_in,
  } = extensions

  const filtered = customers.filter(({ lead_customer }) => !lead_customer)

  let attending = filtered.map(({ firstname }) => firstname)

  if (checked_in && Array.isArray(checked_in)) {
    attending = checked_in
      .filter(({ lead }) => !lead)
      .map(({ title }) => title)
  }

  const children = chunk(
    filtered.map((item, index) => {
      const {
        firstname,
        lastname,
        extensions,
      } = item

      return {
        firstname,
        lastname,
        phonetic: extensions.name_pronunciation || '',
        gender: extensions.gender || '',
        relationship: extensions.relationship || '',
        age: extensions.age || '',
        favourite_thing: `${extensions.favourite_thing || ''}${extensions.favourite_thing_relationship ? ` (${extensions.favourite_thing_relationship})` : ''}`,
        favourite_thing_relationship: extensions.favourite_thing_relationship || '',
        favourite_activity: extensions.favourite_activity || '',
        memorable_event: extensions.memorable_event || '',
        index: index + 1,
        total: filtered.length,
        visits: extensions.attendance && extensions.attendance.length || extensions.visited || 0,
        attending: attending.includes(firstname),
        attendance: extensions.attendance || [],
      }
    }),
    2,
  )

  return {
    firstname,
    lastname,
    children,
    total: filtered.length,
    vip: addons.some((cur) => cur.parent.id === 'golden_experience') || is_vip || false,
    wheelchair: ticket_types.filter(({ id }) => id === 'tt_wheelchair').length > 0 || false,
    queue: getQueue(),
  }
}

const InfoCardsLoader = ({ orderRef: orderRefProp, isPreview }) => {
  const { orderRef } = useParams()
  const { isFetching, isSuccess, isError, data, status } =
    orderRef === 'testcard'
      ? getTestData()
      : useGetOrder({ id: orderRefProp || orderRef })

  useEffect(() => {
    if (!isPreview && isSuccess) {
      window.addEventListener('afterprint', () => window.close())
      window.print()
    }
  })

  if (orderRef === 'undefined') return <InfoCards noId noData />

  if (isFetching) return <InfoCards isFetching noData />

  if (isError) return <InfoCards isError={status.error} noData />

  if (!isSuccess || (isSuccess && data.length === 0)) return <InfoCards noData />

  return (
    <InfoCards
      data={decorate(data)}
      isPreview={isPreview}
    />
  )
}

const getTestData = () => {
  return {
    isFetching: false,
    isSuccess: true,
    isError: false,
    status: 'success',
    data: {
      customer: {
        firstname: 'Test',
        lastname: 'Surname',
      },
      customers: [
        {
          firstname: 'Child',
          lastname: 'Surname',
          extensions: {
            name_pronunciation: 'Ch-eye-el-duh',
            gender: 'boy',
            age: 7,
            favourite_thing: 'Puppy',
            favourite_thing_relationship: 'Pet',
            favourite_activity: 'Painting',
            memorable_event: 'Acted in school play',
            visited: true,
          },
        },
        {
          firstname: 'Sibling',
          lastname: 'Surname',
          extensions: {
            name_pronunciation: 'Sib-ll-ing',
            gender: 'girl',
            age: 5,
            favourite_thing: 'Bicycle',
            favourite_thing_relationship: 'Toy',
            favourite_activity: 'Football',
            memorable_event: 'Won kicking competition',
            visited: false,
          },
        },
      ],
      items: [
        {
          product: {},
          addons: [
            {
              parent: {
                id: 'golden_experience',
              },
            },
          ],
          ticket_types: [
            {
              id: 'tt_wheelchair',
            },
          ],
        },
      ],
      extensions: {},
      queue: getQueue(),
    },
  }
}

const getQueue = () => {
  const params = new URLSearchParams(window.location.search)

  const queue = params.get('queue') || '-'
  return queue
}
export default InfoCardsLoader
