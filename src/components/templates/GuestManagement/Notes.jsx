import React, { useState, useEffect } from 'react'

import {
  Text,
  Box,
  Container,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Checkbox,
  useDisclosure,
} from '@chakra-ui/react'

import { AddIcon, ArrowForwardIcon } from '@chakra-ui/icons'

const IMPORTANT_DELIMITER = '::!IMPORTANT!::'

const ActionNotes = ({ change }) => {
  return (
    <Button
      rightIcon={<AddIcon />}
      onClick={change}
      bg={'transparent'}
      border={'2px solid var(--chakra-colors-dark-blue)'}
      height={'5rem'}
      borderRadius={'2.5rem'}
      fontSize={'1.25rem'}
      padding={'0 2.5rem'}
      margin={'0 auto'}
    >
      {'Add a note to staff'}
    </Button>
  )
}

const NotesEditor = ({ notes, submit, isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSubmit = async (value) => {
    const payload = [value]

    await submit(payload)
  }

  return (
    <>
      <Container centerContent>
        <ActionNotes change={() => onOpen()} />
      </Container>
      <NotesModal
        notes={notes}
        isOpen={isOpen}
        onClose={onClose}
        submit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  )
}

const NotesModal = ({ isOpen, onClose, submit, isLoading }) => {
  const [state, setState] = useState({
    important: false,
    content: '',
  })

  useEffect(() => {
    if (!isOpen && state.content !== '') {
      setState({
        important: false,
        content: '',
      })
    }
  }, [isOpen, state.content])

  const handleChange = (event) => {
    const value = event.target.value

    if (value.length <= 150) {
      const payload = { ...state }

      payload.content = event.target.value

      setState(payload)
    }
  }

  const handleImportantToggle = (important) => {
    const payload = { ...state }

    payload.important = important

    setState(payload)
  }

  const submitWrapper = async () => {
    await submit({
      note: `${state.important ? IMPORTANT_DELIMITER : ''}${state.content}`,
      type: 'booking',
    })

    onClose()
  }

  const remaining = Math.max(150 - state.content.length, 0)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{'Add a note'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textAlign={'center'} marginBottom={'1rem'}>
            {'Add a note for your colleagues to inform them about this order.'}
          </Text>
          <Textarea
            placeholder={'Add a note'}
            onChange={handleChange}
            value={state.content}
          />
          <Text
            textAlign={'right'}
            color={'grey2'}
          >{`${remaining} characters left`}</Text>
          <Container centerContent margin={'2rem 0'}>
            <InputCheck
              value={state.important}
              placeholder={'Mark as important'}
              change={handleImportantToggle}
            />
          </Container>
        </ModalBody>
        <ModalFooter justifyContent={'center'}>
          <Button
            onClick={submitWrapper}
            rightIcon={<ArrowForwardIcon />}
            bg={'dark-blue'}
            color={'white'}
            borderRadius={'0.25rem'}
            padding={'2rem'}
            isLoading={isLoading}
          >
            {'Add a note'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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

export default NotesEditor

export { IMPORTANT_DELIMITER }
