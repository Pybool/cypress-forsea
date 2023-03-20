import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Heading,
  Text,
  Box,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Grid,
  GridItem,
  Checkbox,
  Container,
  SimpleGrid,
  Circle,
} from '@chakra-ui/react'

import { CheckIcon, ArrowForwardIcon } from '@chakra-ui/icons'

import Icon from '@harmony/atoms/Icon'

const Flow = ({
  area,
  isOpen,
  onClose,
  order,
  tickets,
  redeem,
  updateOrderExtensions,
  jingles,
  location = 'lap_fc_woodland',
  isLoading,
  group,
}) => {
  const [step, setStep] = useState(0)

  const steps = [
    {
      component: Attending,
      title: 'Who\'s attending?',
    },
    ...(jingles > 0 ? [{ component: Jingles, title: 'Jingles to issue' }] : []),
    {
      component: Success,
      title: '',
    },
  ]

  const Component = steps[step].component

  const handleNext = () => {
    setStep(step + 1)
  }

  return (
    <Drawer size={'mid'} isOpen={isOpen} placement={'bottom'} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent
        minH={'70vh'}
        maxH={'80vh'}
        borderRadius={'0.5rem 0.5rem 0 0'}
      >
        <DrawerCloseButton />
        <DrawerHeader>{steps[step].title}</DrawerHeader>
        <DrawerBody>
          <Component
            area={area}
            advance={handleNext}
            data={tickets}
            redeem={redeem}
            updateOrderExtensions={updateOrderExtensions}
            jingles={jingles}
            close={onClose}
            order={order}
            location={location}
            isLoading={isLoading}
            group={group}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

const Action = ({ label, change, disabled, isLoading }) => {
  return (
    <Button
      onClick={change}
      rightIcon={<ArrowForwardIcon />}
      bg={'dark-blue'}
      color={'white'}
      borderRadius={'0.25rem'}
      width={'50vw'}
      padding={'2rem'}
      isDisabled={disabled}
      isLoading={isLoading}
    >
      {label}
    </Button>
  )
}

const getSelectedCheckins = (data, selected) => {
  const extensions = selected.map((id) => {
    const index = data.findIndex((item) => id === item.id)

    return data[index].check_in_values
  })

  return extensions
}

const checkSubmitValid = (extensions) => {
  const children = extensions.filter(({ type }) => type === 'tt_children_under_13')
  const adult = extensions.filter(({ type }) => type === 'tt_adult' || type === 'tt_carer')

  return adult.length > 0 && children.length > 0
}

const Attending = ({
  order,
  data,
  advance,
  redeem,
  updateOrderExtensions,
  location,
  isLoading,
}) => {
  const [selected, setSelected] = useState([])

  const handleChange = (field) => (value) => {
    const state = [...selected]

    if (value) {
      state.push(field)
    } else {
      const index = state.findIndex((id) => id === field)

      state.splice(index, 1)
    }

    setSelected(state)
  }

  const handleSubmit = async () => {
    const extensions = getSelectedCheckins(data, selected)

    const ids = selected.join(',')

    await redeem(ids, {
      location_id: location,
      scanned_at: new Date().toISOString(), // '2022-11-30T13:02:13.182Z' USE ME TO HACK FOR REPORTS
    })

    await updateOrderExtensions(order.id, { checked_in: extensions })

    advance()
  }

  const extensions = getSelectedCheckins(data, selected)

  const hasMinimum = checkSubmitValid(extensions)

  return (
    <Box>
      <Grid
        gridAutoFlow={'column'}
        templateRows={`repeat(${Math.ceil(data.length / 2)}, 1fr)`}
        templateColumns={'repeat(2, 1fr)'}
        gap={'1rem'}
        padding={'0 10%'}
      >
        {data.map((item) => {
          return (
            <GridItem as={'label'} key={item.id} cursor={'pointer'}>
              <InputCheck
                value={selected.includes(item.id)}
                change={handleChange(item.id)}
                placeholder={item.title}
              />
            </GridItem>
          )
        })}
      </Grid>
      <Container centerContent marginTop={'3rem'}>
        <Action
          label={'Continue to check in'}
          change={handleSubmit}
          disabled={selected.length === 0 || !hasMinimum}
          isLoading={isLoading}
        />
      </Container>
    </Box>
  )
}

const Jingles = ({
  order,
  advance,
  jingles,
  updateOrderExtensions,
  isLoading,
}) => {
  const handleSubmit = async () => {
    await updateOrderExtensions(order.id, { jingles_issued: true, jingles_issued_stamp: new Date().toISOString() })

    advance()
  }

  return (
    <Box>
      <Container centerContent>
        <Flex
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          width={'10rem'}
          height={'10rem'}
          border={'2px solid var(--chakra-colors-grey3)'}
          borderRadius={'100%'}
        >
          <Text fontSize={'3rem'} fontWeight={'bold'} lineHeight={1}>
            {jingles}
          </Text>
          <Text fontSize={'1.25rem'} fontWeight={'bold'}>
            {'Jingles'}
          </Text>
        </Flex>
      </Container>
      <Container centerContent marginTop={'3rem'}>
        <Action
          label={'Issue jingles and check in'}
          change={handleSubmit}
          isLoading={isLoading}
        />
      </Container>
    </Box>
  )
}

const tour_map = {
  huskies: 'Husky',
  reindeers: 'Reindeer',
}

const Success = ({ area, data, order, group }) => {
  const navigate = useNavigate()

  const redeemed = data.filter((item) => item.redemptions.length > 0)

  const child_tickets = redeemed.filter(
    (item) => item.ticket_type.id === 'tt_children_under_13',
  )

  const { customers } = order

  const lead_info = customers.filter(({ lead_customer }) => lead_customer)[0]

  return (
    <Box>
      <Container centerContent maxWidth={'100%'}>
        <Circle
          width={'4rem'}
          height={'4rem'}
          color={'white'}
          bg={'success'}
          marginBottom={'1rem'}
        >
          <CheckIcon w={'1.5rem'} h={'1.5rem'} />
        </Circle>
        <Heading as={'h2'}>{'Check in successful'}</Heading>
        <Text>{`This is the first visit for the ${lead_info.lastname} family.`}</Text>
        <Text>{'Welcome them and issue them with'}</Text>
        <SimpleGrid columns={2} marginTop={'1rem'} gap={'1rem'}>
          <Flex
            padding={'0.5rem'}
            border={'2px solid var(--chakra-colors-grey3)'}
            borderRadius={'0.5rem'}
          >
            <Icon name={group && group === 'reindeers' ? 'reindeer' : 'husky'} width={'4rem'} height={'4rem'} />
            <Container>
              <Text
                fontSize={'2rem'}
                fontWeight={'bold'}
              >{`x${redeemed.length}`}</Text>
              <Text fontWeight={'bold'}>{`${tour_map[group]} stickers`}</Text>
            </Container>
          </Flex>
          <Flex
            padding={'0.5rem'}
            border={'2px solid var(--chakra-colors-grey3)'}
            borderRadius={'0.5rem'}
          >
            <Icon name={'passport'} width={'4rem'} height={'4rem'} />
            <Container>
              <Text
                fontSize={'2rem'}
                fontWeight={'bold'}
              >{`x${child_tickets.length}`}</Text>
              <Text fontWeight={'bold'}>{'Children passports'}</Text>
            </Container>
          </Flex>
        </SimpleGrid>
      </Container>
      <Container centerContent marginTop={'3rem'}>
        <Action label={'Back to search guests'} change={() => navigate(`/area/${area.id}/guests`)} />
      </Container>
    </Box>
  )
}

const InputCheck = ({ value, placeholder, change }) => {
  const handleChange = () => {
    change(!value)
  }

  return (
    <Box
      padding={'1rem'}
      border={
        value ? '1px solid #6FC0C6' : '1px solid var(--chakra-colors-grey3)'
      }
      borderRadius={'0.5rem'}
      boxShadow={'base'}
    >
      <Checkbox
        onChange={handleChange}
        isChecked={value}
        fontWeight={'bold'}
        width={'100%'}
      >
        {placeholder}
      </Checkbox>
    </Box>
  )
}

export default Flow
