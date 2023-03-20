import React from 'react'

import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
import upperFirst from 'lodash/upperFirst'

import { useParams } from 'react-router-dom'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Global } from '@emotion/react'

import useGoodList from '@harmony/hooks/useGoodList'

import Loader from '@harmony/molecules/Loader'

const Name = ({ children }) => (
  <Text fontSize={'2rem'} fontFamily={'goodList'}>
    {children}
  </Text>
)

const GoodList = ({
  isFetching,
  data,
}) => {
  return (
    <Container centerContent textAlign={'center'} color={'var(--chakra-colors-black)'} mt={'1rem'}>
      <Global
        styles={{
          '@font-face': {
            fontFamily: 'Madelyn',
            fontStyle: 'normal',
            fontWeight: 400,
            fontDisplay: 'swap',
            src: 'url(\'/fonts/Madelyn-Regular.woff2\') format(\'woff2\'), url(\'/fonts/Madelyn-Regular.woff\') format(\'woff\')',
          },
          '@page': {
            size: 'a4 portrait',
            width: 'auto',
          },
          '@media print': {
            'html, body': {
              size: 'a4 portrait',
              width: 'auto',
            },
          },
        }}
      />
      <Heading as={'h1'} fontSize={'2.75rem'} fontFamily={'goodList'} fontWeight={'normal'}>
        {'Father Christmas\' Good List'}
      </Heading>
      {isFetching && (
        <Loader />
      )}
      {!isFetching && data.length === 0 && (
        <VStack my={'2rem'}>
          <Name>{'There\'s no one here today'}</Name>
        </VStack>
      )}
      {data.length > 0 && (
        <Box
          my={'2rem'}
          width={'100%'}
          sx={{ columnCount: 3 }}
        >
          <>
            {data.map(({ id, name }, index) => (
              <Name key={`${id}-${name}-${index}`}>{name}</Name>
            ))}
          </>
        </Box>
      )}
    </Container>
  )
}

const goodListTransform = (data = []) =>
  sortBy(
    uniqBy(
      data.flatMap(({ id, customers = [] }) =>
        customers
          .filter(({ lead_customer }) => !lead_customer)
          .map(({ firstname }) => ({ id, name: upperFirst(firstname.trim()) }))
          .filter(({ name }) => !['None', 'Cancelled'].includes(name)),
      ),
      'name',
    ),
    ['name'],
  )

const GoodListLoader = ({ date: dateProp }) => {
  const params = useParams()
  const date = params.date || dateProp

  const {
    isFetching,
    data,
  } = useGoodList({
    date,
    decorate: goodListTransform,
  })

  return (
    <GoodList
      isFetching={isFetching}
      data={data}
    />
  )
}

export default GoodListLoader
