import React, { useState, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import {
  Heading,
  Box,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react'

import Drawer from '@harmony/atoms/Drawer'
import ActionButton from '@harmony/atoms/Button/Action'
import Icon from '@harmony/atoms/Icon'
import noop from '@harmony/libs/noop'

const ChildCardPrintConfirmation = ({
  isOpen = true,
  onClose = noop,
  title,
  color,
  id,
  children,
}) => {
  const navigate = useNavigate()

  const {
    id: areaId,
  } = useParams()

  const [
    printing,
    setPrinting,
  ] = useState(null)

  const [
    printFail,
    setFail,
  ] = useState(false)

  const handlePrint = (payload) => {
    setFail(false)

    setPrinting(payload)

    const { path, queue } = payload

    window.open(`${path}?queue=${queue}`, '_blank')
  }

  const handleClose = () => {
    setFail(false)

    setPrinting(null)

    onClose()
  }

  useEffect(() => {
    if (printing != null) {
      setPrinting(null)
      navigate(`/area/${areaId}/guests`)
    }
  })

  return (
    <Drawer
      sx={{ '--harmony-brand': color }}
      isOpen={isOpen}
      header={
        <Flex direction={'column'}>
          <Icon name={'MdCheckCircle'} height={32} color={'success'} />
          <Heading as={'h2'} size={'xl'} textAlign={'center'}>
            {title}
          </Heading>
        </Flex>
      }
      footer={
        <VStack spacing={3} mx={'auto'}>
          {printFail && (
            <Text fontWeight={'bold'} color={'failure'}>{'Print request failed, please check the printer.'}</Text>
          )}
          <Flex
            direction={['column', 'column', 'column', 'row']}
            justifyContent={'space-between'}
            gap={'1rem'}
          >
            <ActionButton
              disabled={printing != null}
              rightIcon={<Icon name={'MdEast'} height={8} />}
              onClick={() =>
                handlePrint({
                  action: 'print',
                  queue: 'a',
                  path: `/print/child-cards/${id}`,
                  type: 'child-cards',
                  ref: id,
                  stamp: Date.now(),
                })
              }
              w={'max-content'}
              isLoading={printing != null}
            >
              {'Print at Lobby A'}
            </ActionButton>
            <ActionButton
              disabled={printing != null}
              rightIcon={<Icon name={'MdEast'} height={8} />}
              onClick={() =>
                handlePrint({
                  action: 'print',
                  queue: 'b',
                  path: `/print/child-cards/${id}`,
                  type: 'child-cards',
                  ref: id,
                  stamp: Date.now(),
                })
              }
              w={'max-content'}
              isLoading={printing != null}
            >
              {'Print at Lobby B'}
            </ActionButton>
          </Flex>
        </VStack>
      }
      onClose={handleClose}
      overflow={'visible'}
    >
      <Box>{children}</Box>
    </Drawer>
  )
}

export default ChildCardPrintConfirmation
