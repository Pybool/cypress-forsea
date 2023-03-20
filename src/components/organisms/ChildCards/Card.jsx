import React from 'react'

import { Global } from '@emotion/react'

import {
  HStack,
  Divider,
  Box,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import Card from '@harmony/atoms/Card'
import ChildInfo from './Info'
import CountBadge from './Count'
import ExtraBadge from './Extra'
import QueueBadge from './Queue'

const Title = ({ firstname, lastname, ...rest }) => (
  <Text
    as={'h2'}
    fontSize={'2xl'}
    fontWeight={'extrabold'}
    fontFamily={'heading'}
    lineHeight={'2.5rem'}
    textAlign={'center'}
    textTransform={'uppercase'}
    {...rest}
  >
    {lastname}, {firstname}
  </Text>
)

const ChildCard = ({
  cardNo = 0,
  cardTotal = 0,
  data = {},
  childDataPair = [],
  isPreview = false,
  ...rest
}) => {
  const {
    firstname,
    lastname,
    vip,
    wheelchair,
    queue,
  } = data

  const [
    child1,
    child2,
  ] = childDataPair

  return (
    <Box
      as={isPreview ? Card : null}
      border={isPreview ? '4px solid' : null}
      borderColor={'grey3'}
      width={!isPreview && '6in'}
      height={!isPreview && '3.5in'}
      pos={'relative'}
      px={isPreview ? 2 : 4}
      py={isPreview ? 3 : 5}
      sx={{ '&': { pageBreakAfter: 'always' } }}
      {...rest}
    >
      {!isPreview && (
        <Global
          styles={{
            html: {
              fontSize: '50%',
            },
          }}
        />
      )}
      <SimpleGrid as={'header'} columns={3} mb={2}>
        <HStack mr={'auto'} spacing={isPreview ? null : 3}>
          {vip && (
            <ExtraBadge icon={'MdStar'} isPreview={isPreview}>
              {'VIP'}
            </ExtraBadge>
          )}
          {wheelchair && (
            <ExtraBadge icon={'MdAccessible'} isPreview={isPreview}>
              {'Wheelchair'}
            </ExtraBadge>
          )}
        </HStack>
        <Title firstname={firstname} lastname={lastname} />
        <HStack ml={'auto'} spacing={isPreview ? null : 3}>
          <Box mr={'auto'}>
            <QueueBadge queue={queue} isPreview={isPreview} />
          </Box>
          <Box mr={'auto'}>
            <CountBadge index={cardNo} total={cardTotal} isPreview={isPreview} />
          </Box>
        </HStack>
      </SimpleGrid>
      {!isPreview && (
        <Divider mt={6} borderColor={'grey3'} />
      )}
      <SimpleGrid columns={2} h={isPreview ? 'auto' : '100%'}>
        {child1 && (
          <ChildInfo
            attending={child1.attending}
            name={child1.firstname}
            phonetic={child1.phonetic}
            visits={child1.visits}
            age={child1.age}
            loves={child1.favourite_thing}
            likes={child1.favourite_activity}
            achievement={child1.memorable_event}
            childIndex={child1.index}
            childTotal={child1.total}
            isPreview={isPreview}
            borderRight={'1px solid'}
            borderRightColor={'grey3'}
          />
        )}
        {child2 && (
          <ChildInfo
            attending={child2.attending}
            name={child2.firstname}
            phonetic={child2.phonetic}
            visits={child2.visits}
            age={child2.age}
            loves={child2.favourite_thing}
            likes={child2.favourite_activity}
            achievement={child2.memorable_event}
            childIndex={child2.index}
            childTotal={child2.total}
            isPreview={isPreview}
          />
        )}
      </SimpleGrid>
    </Box>
  )
}

export default ChildCard
