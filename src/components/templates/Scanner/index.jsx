import React, { useState, useEffect, useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { DateTime } from 'luxon'

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Circle,
  Button,
  Grid,
  GridItem,
  Icon,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react'

import { CheckIcon, ArrowForwardIcon } from '@chakra-ui/icons'

import { VscFile } from 'react-icons/vsc'

import QrScanner from 'qr-scanner'

import useGetOrder from '@harmony/hooks/useGetOrder'

import parseGuests from '@harmony/libs/parseGuests'
import Badge from '@harmony/atoms/Badge/base'

const Scanner = ({ area, role }) => {
  const toast = useToast()

  const [success, setSuccess] = useState(false)

  const [id, setId] = useState(null)

  const { data, isSuccess, isFetching, isError } = useGetOrder({
    id,
  })

  useEffect(() => {
    if (isSuccess && !isFetching && id != null) {
      setSuccess(true)
    }
  }, [setSuccess, isSuccess, id, isFetching])

  useEffect(() => {
    if (isError && !isFetching) {
      toast({
        title: 'QR Code not recognised',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })

      setSuccess(false)
    }
  }, [isError, isFetching, toast])

  const handleSuccess = useCallback(
    (result) => {
      const { data } = result

      setId(data)
    },
    [setId],
  )

  const handleReset = () => {
    setId(null)

    setSuccess(false)
  }

  return (
    <>
      {!success && <ScanQR change={handleSuccess} />}
      {success && data.id && (
        <Details data={data} area={area} role={role} reset={handleReset} />
      )}
    </>
  )
}

const ScanQR = React.memo(({ change }) => {
  useEffect(() => {
    const qrScanner = new QrScanner(
      document.getElementById('scanner'),
      change,
      {
        onDecodeError: () => {},
        returnDetailedScanResult: true,
      },
    )

    qrScanner
      .start()
      .then(() => {})
      .catch(() => qrScanner.start())

    return () => {
      qrScanner.stop()
    }
  })

  return (
    <Box padding={'2rem 3rem'}>
      <Container centerContent padding={'2rem 0'}>
        <Heading as={'h2'}>{'Scan a QR code'}</Heading>
      </Container>
      <video id={'scanner'} />
    </Box>
  )
})

const divider = {
  content: '""',
  display: 'block',
  position: 'absolute',
  top: '1rem',
  bottom: '1rem',
  right: '0',
  width: '1px',
  background: 'var(--chakra-colors-grey3)',
}

const getThemedText =
  (base) =>
    ({ children, ...rest }) =>
      (
        <Text {...base} {...rest}>
          {children}
        </Text>
      )

const getQuantity = (tickets) =>
  tickets.reduce((acc, cur) => {
    return acc + cur.qty
  }, 0)

const ActionOrder = ({ change }) => {
  return (
    <Button
      rightIcon={<ArrowForwardIcon />}
      onClick={change}
      bg={'transparent'}
      border={'2px solid var(--chakra-colors-dark-blue)'}
      height={'6rem'}
      borderRadius={'3rem'}
      width={'100%'}
      fontSize={'1.5rem'}
    >
      {'Order details'}
    </Button>
  )
}

const Details = ({ data, area, reset, role }) => {
  const navigate = useNavigate()

  const {
    id,
    lead_info,
    jingles_info,
    adult_tickets,
    child_tickets,
    infant_tickets,
    carer_tickets,
    booked_unit,
    wheelchair_tickets,
    vip,
  } = parseGuests(data)

  const ThemedText = getThemedText({
    color: area.color,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  })

  const StrongText = getThemedText({
    fontSize: '1.75rem',
    fontWeight: 'bold',
  })

  return (
    <>
      <Container maxW={'100%'} padding={'2rem 25vw'}>
        <Container centerContent padding={'2rem 0'}>
          <Circle
            width={'4rem'}
            height={'4rem'}
            color={'white'}
            bg={'success'}
            marginBottom={'1rem'}
          >
            <CheckIcon w={'1.5rem'} h={'1.5rem'} />
          </Circle>
          <Heading as={'h2'}>{'Valid order'}</Heading>
        </Container>
        <Box>
          <Text
            fontWeight={'bold'}
            fontSize={'1.75rem'}
            textAlign={'center'}
            padding={'1rem 0'}
          >{`${lead_info.lastname}, ${lead_info.firstname}`}</Text>
          <SimpleGrid my={6} spacing={3} columns={2}>
            {vip && (
              <Badge justifyContent="center" icon="MdStar">
                VIP Order
              </Badge>
            )}
            {wheelchair_tickets.length > 0 && (
              <Badge justifyContent="center" icon="MdAccessible">
                Wheelchair
              </Badge>
            )}
          </SimpleGrid>
          <Grid
            templateAreas={`
            'day tour group'
            'tickets tickets jingles'
          `}
          >
            <GridItem
              area={'day'}
              borderBottom={'1px solid var(--chakra-colors-grey3)'}
              borderTop={'1px solid var(--chakra-colors-grey3)'}
            >
              <Box _after={divider} position={'relative'} padding={'1rem'}>
                <ThemedText>{'Show day'}</ThemedText>
                <StrongText>
                  {DateTime.fromISO(booked_unit.start_date).toFormat(
                    'ccc dd LLL',
                  )}
                </StrongText>
              </Box>
            </GridItem>
            <GridItem
              area={'tour'}
              borderBottom={'1px solid var(--chakra-colors-grey3)'}
              borderTop={'1px solid var(--chakra-colors-grey3)'}
            >
              <Box _after={divider} position={'relative'} padding={'1rem'}>
                <ThemedText>{'Tour Time'}</ThemedText>
                <StrongText>
                  {DateTime.fromISO(booked_unit.start_time).toFormat('T')}
                </StrongText>
              </Box>
            </GridItem>
            <GridItem
              area={'group'}
              borderBottom={'1px solid var(--chakra-colors-grey3)'}
              borderTop={'1px solid var(--chakra-colors-grey3)'}
            >
              <Box padding={'1rem'}>
                <ThemedText>{'Group'}</ThemedText>
                <StrongText>{'NA'}</StrongText>
              </Box>
            </GridItem>
            <GridItem
              area={'tickets'}
              borderBottom={'1px solid var(--chakra-colors-grey3)'}
            >
              <Flex
                textAlign={'center'}
                gap={'1rem'}
                _after={divider}
                position={'relative'}
                padding={'1rem'}
              >
                <Box flex={'1 1'}>
                  <StrongText>{getQuantity(adult_tickets)}</StrongText>
                  <ThemedText>{'Adults'}</ThemedText>
                </Box>
                <Box flex={'1 1'}>
                  <StrongText>{getQuantity(child_tickets)}</StrongText>
                  <ThemedText>{'Children'}</ThemedText>
                </Box>
                <Box flex={'1 1'}>
                  <StrongText>{getQuantity(infant_tickets)}</StrongText>
                  <ThemedText>{'Infants'}</ThemedText>
                </Box>
                <Box flex={'1 1'}>
                  <StrongText>{getQuantity(carer_tickets)}</StrongText>
                  <ThemedText>{'PA'}</ThemedText>
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              area={'jingles'}
              borderBottom={'1px solid var(--chakra-colors-grey3)'}
            >
              <Box padding={'1rem'}>
                <StrongText>{jingles_info}</StrongText>
                <ThemedText>{'Jingles'}</ThemedText>
              </Box>
            </GridItem>
          </Grid>
          <Flex
            gap={'0.25rem'}
            alignItems={'center'}
            justifyContent={'center'}
            padding={'1rem 0'}
          >
            <Icon as={VscFile} w={'1.25rem'} h={'1.25rem'} />
            <Text>{`Order ref: ${id}`}</Text>
          </Flex>
        </Box>
        {role !== 'scanning' && (
          <Box marginTop={'2rem'}>
            <ActionOrder
              change={() => navigate(`/area/${area.id}/guests/${id}`)}
            />
          </Box>
        )}
      </Container>
      <Flex
        padding={'3rem 0'}
        bg={'white'}
        marginTop={'1.5rem'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Button
          onClick={reset}
          rightIcon={<ArrowForwardIcon />}
          bg={'dark-blue'}
          color={'white'}
          borderRadius={'0.25rem'}
          width={'50vw'}
          padding={'2rem'}
        >
          {'Next QR Code'}
        </Button>
      </Flex>
    </>
  )
}

export default Scanner
