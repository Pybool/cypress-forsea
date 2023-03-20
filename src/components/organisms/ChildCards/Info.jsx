import React from 'react'

import {
  Badge,
  Flex,
  Box,
  Heading,
  Text,
  ListItem,
  List,
} from '@chakra-ui/react'

import Icon from '@harmony/atoms/Icon'
import ChildCountBadge from './ChildCount'

import ordinalSuffix from '@harmony/libs/ordinalSuffix'

const Name = ({ name, isPreview }) => (
  <Heading
    as={'h3'}
    size={isPreview ? '2xl' : '3xl'}
    fontWeight={'extrabold'}
    textTransform={'uppercase'}
  >
    {name}
  </Heading>
)

const Phonetic = ({ phonetic }) => (
  <Text fontSize={'3xl'} lineHeight={'1'}>{`{${phonetic}}`}</Text>
)

const Visits = ({ visits, isPreview }) => {
  const visitCount = visits + 1

  const visitsStyles = {
    marginTop: isPreview ? 4 : 16,
    '@media print': {
      marginTop: 8,
    },
  }

  return (
    <Badge
      bg={'grey4'}
      fontSize={'2xl'}
      textTransform={'lowercase'}
      py={2}
      px={7}
      borderRadius={8}
      mt={isPreview ? 4 : 16}
      sx={visitsStyles}
    >
      {visitCount}
      <Box
        as={'sup'}
        lineHeight={'0'}
        fontSize={'0.8em'}
        verticalAlign={'super'}
        position={'static'}
      >
        {ordinalSuffix(visitCount)}
      </Box>
      {' visit'}
    </Badge>
  )
}

const NotAttending = ({ isPreview }) => {
  const visitsStyles = {
    marginTop: isPreview ? 4 : 16,
    '@media print': {
      marginTop: 8,
    },
  }

  return (
    <Badge
      bg={'grey4'}
      fontSize={'2xl'}
      py={2}
      px={7}
      borderRadius={8}
      mt={isPreview ? 4 : 16}
      sx={visitsStyles}
    >
      {'Not Attending'}
    </Badge>
  )
}

const InfoList = ({ age, loves, likes, achievement, isPreview }) => {
  const infoListStyles = {
    fontSize: isPreview ? 'lg' : 'xl',
    '@media print': {
      fontSize: '2xl',
    },
  }

  const iconStyles = {
    height: 5,
    '@media print': {
      height: '1em',
    },
  }

  return (
    <List mt={8} spacing={3} sx={infoListStyles} lineHeight={'1.1'}>
      {age && (
        <ListItem>
          <Flex>
            <Icon
              name={'MdCalendarToday'}
              color={'var(--icon-color)'}
              mr={3}
              sx={iconStyles}
            />
            {`Aged ${age}`}
          </Flex>
        </ListItem>
      )}
      {loves && (
        <ListItem>
          <Flex>
            <Icon
              name={'MdFavorite'}
              color={'var(--icon-color)'}
              mr={3}
              sx={iconStyles}
            />
            {loves}
          </Flex>
        </ListItem>
      )}
      {likes && (
        <ListItem>
          <Flex>
            <Icon
              name={'MdThumbUp'}
              color={'var(--icon-color)'}
              mr={3}
              sx={iconStyles}
            />
            {likes}
          </Flex>
        </ListItem>
      )}
      {achievement && (
        <ListItem>
          <Flex>
            <Icon
              name={'MdSchedule'}
              color={'var(--icon-color)'}
              mr={3}
              sx={iconStyles}
            />
            {achievement}
          </Flex>
        </ListItem>
      )}
    </List>
  )
}

const containerStyles = {
  alignItems: 'center',
  '@media print': {
    alignItems: 'start',
  },
}

const infoStyles = {
  '@media print': {
    marginTop: '3rem',
  },
}

const ChildInfo = ({
  attending,
  name,
  phonetic,
  visits,
  age,
  loves,
  likes,
  achievement,
  childIndex = 0,
  childTotal = 0,
  isPreview = false,
  sx = [],
  ...rest
}) => {
  if (!isPreview) {
    return (
      <Flex
        padding={12}
        position={'relative'}
        sx={{ ...containerStyles, ...sx }}
        {...rest}>
        <Box
          className={'child-info'}
          sx={{
            '--icon-color': 'var(--harmony-brand, currentColor)',
            ...infoStyles,
          }}
          fontWeight={'bold'}
          textAlign={'left'}
        >
          <ChildCountBadge
            index={childIndex}
            total={childTotal}
            isPreview={isPreview}
          />
          {name && (
            <Name name={name} isPreview={isPreview} />
          )}
          {phonetic && (
            <Phonetic phonetic={phonetic} />
          )}
          {!attending && (
            <NotAttending isPreview={isPreview} />
          )}
          {attending && (
            <Visits visits={visits} isPreview={isPreview} />
          )}
          {(age || loves || likes || achievement) && (
            <InfoList
              age={age}
              loves={loves}
              likes={likes}
              achievement={achievement}
              isPreview={isPreview}
            />
          )}
        </Box>
      </Flex>
    )
  }

  return (
    <Box
      className={'child-info'}
      sx={{
        '--icon-color': 'var(--harmony-brand, currentColor)',
      }}
      fontWeight={'bold'}
      textAlign={'left'}
      p={12}
      pos={'relative'}
      {...rest}
    >
      <ChildCountBadge
        index={childIndex}
        total={childTotal}
        isPreview={isPreview}
      />
      {name && (
        <Name name={name} isPreview={isPreview} />
      )}
      {phonetic && (
        <Phonetic phonetic={phonetic} />
      )}
      {!attending && (
        <NotAttending isPreview={isPreview} />
      )}
      {attending && (
        <Visits visits={visits} isPreview={isPreview} />
      )}
      {(age || loves || likes || achievement) && (
        <InfoList
          age={age}
          loves={loves}
          likes={likes}
          achievement={achievement}
          isPreview={isPreview}
        />
      )}
    </Box>
  )
}

export default ChildInfo
