import React from 'react'

import {
  Box,
  Heading,
  HStack,
  StackDivider,
  Text,
} from '@chakra-ui/react'

const Details = ({ counts, labels }) => {
  const {
    groups = 0,
    adults = 0,
    children = 0,
  } = counts

  const {
    groups: groupsLabel,
    adults: adultsLabel,
    children: childrenLabel,
  } = labels

  return (
    <HStack
      divider={<StackDivider borderColor={'#e0e0e0'} />}
      spacing={'0.5rem'}
      px={'1rem'}
      align={'stretch'}
      w={'100%'}
    >
      <Box flexBasis={'33%'}>
        <DetailContent
          title={groupsLabel}
          label={groups}
          color={groups > 48 ? 'failure' : 'dark-blue'}
        />
      </Box>
      <Box flexBasis={'30%'}>
        <DetailContent
          title={adultsLabel}
          label={adults}
          color={adults > 110 ? 'failure' : 'dark-blue'}
        />
      </Box>
      <Box flexBasis={'30%'}>
        <DetailContent
          title={childrenLabel}
          label={children}
          color={children > 95 ? 'failure' : 'dark-blue'}
        />
      </Box>
    </HStack>
  )
}

const DetailContent = ({
  title,
  label,
  color,
}) => {
  return (
    <>
      <Heading
        as={'h3'}
        size={'sm'}
        fontWeight={'extrabold'}
        color={'grey2'}
        textTransform="uppercase"
        letterSpacing="-0.01em"
      >
        {title}
      </Heading>
      <Text
        fontSize={'3xl'}
        color={color}
        fontWeight={'extrabold'}
      >
        {label}
      </Text>
    </>
  )
}

export default Details
