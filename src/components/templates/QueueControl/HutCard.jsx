import React from 'react'

import { Box, Flex, Text, Switch, Button } from '@chakra-ui/react'

import { CloseIcon } from '@chakra-ui/icons'

import useTimeElapsed from '@harmony/hooks/useTimeElapsed'

const HutCard = ({
  data,
  toggle,
  change,
  complete,
}) => {
  let stamp = null

  if (data.occupied) {
    const { redemptions } = data.occupied

    stamp = redemptions.filter(({ location }) => location === data.id)[0].scanned_at
  }

  const { elapsed } = useTimeElapsed(stamp)

  const handleToggle = () => {
    toggle(!data.disabled)
  }

  const handleUnRedeem = async () => {
    await change(data.id, data.occupied)
  }

  const handleComplete = async () => {
    await complete('lap_fc_complete', data.occupied)
  }

  return (
    <Box
      bg={data.disabled ? 'grey3' : 'white'}
      borderRadius={'1rem'}
      boxShadow={'md'}
      padding={'1rem'}
      filter={data.disabled ? 'grayscale(100%)' : 'none'}
    >
      <Flex justifyContent={'space-between'}>
        <Text
          fontSize={'1.25rem'}
          fontWeight={'bold'}
          textTransform={'uppercase'}
        >
          {data.title}
        </Text>
        <Box
          position={'relative'}
          bg={elapsed > data.time ? 'failure' : 'success'}
          padding={'0 0.5rem 0 1rem'}
          right={'-1rem'}
        >
          <Text
            color={'white'}
            fontWeight={'bold'}
            as={'span'}
            lineHeight={'1'}
          >
            {`${elapsed} min`}
          </Text>
        </Box>
      </Flex>
      <Box marginBottom={data.occupied ? '0rem' : '2rem'}>
        <Text>{`Staff: ${data.staff}`}</Text>
        <Text>{`Time: ${data.time}`}</Text>
      </Box>
      {data.occupied && (
        <Flex justifyContent={'space-between'} marginTop={'1rem'} marginBottom={'0.5rem'}>
          <Button
            colorScheme={'red'}
            leftIcon={<CloseIcon w={'0.75rem'} h={'0.75rem'} />}
            variant={'link'}
            size={'sm'}
            onClick={() => handleUnRedeem()}
          >
            <Box>
              <Text>{data.occupied.last_name}</Text>
              <Text>{data.occupied.first_name}</Text>
            </Box>
          </Button>
          <Button
            colorScheme={'green'}
            variant={'solid'}
            size={'sm'}
            onClick={() => handleComplete()}
          >
            {'Complete tour'}
          </Button>
        </Flex>
      )}
      <Flex justifyContent={'space-between'}>
        <Text fontWeight={'bold'} textTransform={'uppercase'}>
          {`Mode ${data.mode}`}
        </Text>
        <Switch isChecked={!data.disabled} onChange={handleToggle} />
      </Flex>
    </Box>
  )
}

export default HutCard
