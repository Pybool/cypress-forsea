import React, { useState, useEffect } from 'react'

import {
  Text,
  Box,
  Container,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  Input,
  useDisclosure,
} from '@chakra-ui/react'

import { SettingsIcon } from '@chakra-ui/icons'

import InputSelect from '@harmony/atoms/Select'

const Settings = ({ data, submit, ...rest }) => {
  const [state, setState] = useState(data)

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (isOpen) {
      setState(data)
    }
  }, [isOpen, setState, data])

  const handleChange = (index, field, value) => {
    const current = [...state]

    current[index][field] = value

    setState(current)
  }

  const handleSubmit = () => {
    submit(state)

    onClose()
  }

  return (
    <>
      <Button
        bg={'white'}
        color={'failure'}
        border={'1px solid var(--chakra-colors-failure)'}
        onClick={() => onOpen()}
        leftIcon={<SettingsIcon />}
        {...rest}
      >
        {'Settings'}
      </Button>
      <Drawer
        size={'mid'}
        isOpen={isOpen}
        placement={'bottom'}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent maxH={'80vh'} borderRadius={'0.5rem 0.5rem 0 0'}>
          <DrawerCloseButton />
          <DrawerHeader>{'FC Queue Display Settings'}</DrawerHeader>
          <DrawerBody>
            <Form data={state} change={handleChange} />
          </DrawerBody>
          <DrawerFooter>
            <Container centerContent padding={'1rem 0'}>
              <Button
                onClick={handleSubmit}
                bg={'dark-blue'}
                color={'white'}
                borderRadius={'0.25rem'}
                width={'50vw'}
                padding={'2rem'}
              >
                {'Save changes'}
              </Button>
            </Container>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const Form = ({ data, change }) => {
  const handleChange = (index) => (field, value) => {
    change(index, field, value)
  }

  return (
    <Box>
      {data.map((item, index) => {
        return (
          <LineItem key={item.id} data={item} change={handleChange(index)} />
        )
      })}
    </Box>
  )
}

const LineItem = ({ data, change }) => {
  const { title, staff, time, mode } = data

  const handleChange = (field) => (value) => {
    change(field, value)
  }

  return (
    <Flex
      alignItems={'center'}
      gap={'1rem'}
      padding={'0.5rem 0'}
      borderBottom={'1px solid var(--chakra-colors-grey3)'}
    >
      <Text
        fontSize={'1.25rem'}
        fontWeight={'bold'}
        flexGrow={'0'}
        flexShrink={'1'}
        marginRight={'5rem'}
      >
        {title}
      </Text>
      <Flex alignItems={'center'} gap={'1rem'} flexGrow={'1'}>
        <Text flexGrow={'1'} flexShrink={'0'} fontWeight={'bold'}>
          {'Staff name'}
        </Text>
        <WrappedInput value={staff} change={handleChange('staff')} />
      </Flex>
      <Flex alignItems={'center'} gap={'1rem'} flexGrow={'1'}>
        <Text flexGrow={'1'} flexShrink={'0'} fontWeight={'bold'}>
          {'Hut time'}
        </Text>
        <WrappedInput
          type={'number'}
          value={time}
          change={handleChange('time')}
        />
      </Flex>
      <Flex alignItems={'center'} gap={'1rem'} flexGrow={'1'}>
        <Text flexGrow={'1'} flexShrink={'0'} fontWeight={'bold'}>
          {'Mode'}
        </Text>
        <InputSelect
          value={mode}
          placeholder={'Mode'}
          change={handleChange('mode')}
          options={[
            { label: 'Mode A', value: 'a' },
            { label: 'Mode B', value: 'b' },
            { label: 'Mode C', value: 'c' },
          ]}
        />
      </Flex>
    </Flex>
  )
}

const WrappedInput = ({ type = 'text', value, change }) => {
  return (
    <Input
      type={type}
      value={value}
      onChange={(event) => change(event.target.value)}
    />
  )
}

export default Settings
