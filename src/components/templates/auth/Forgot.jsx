import React, { useState } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import {
  Grid,
  GridItem,
  Heading,
  Container,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react'

import InputText from './components/InputText'
import ActionSubmit from './components/ActionSubmit'

import { forgot } from '@harmony/api/user'

const layout = `
  'info'
  'username'
  'submit'
  'forgot'
`

const ForgotStart = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [state, setState] = useState({
    username: '',
    ...location.state,
  })

  const toast = useToast()

  const handleChange = (field, value) => {
    const payload = { ...state }

    payload[field] = value

    setState(payload)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)

    try {
      await forgot(state)

      setLoading(false)

      navigate('/forgot_confirm', { state: state })
    } catch (error) {
      console.error('ERROR', error)

      toast({
        title: 'Unknown error occured.',
        status: 'error',
        isClosable: true,
      })

      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container centerContent maxWidth={'70vw'}>
        <Heading as={'h2'}>{'Reset your password'}</Heading>
        <Grid
          templateAreas={layout}
          justifyItems={'center'}
          padding={'2rem'}
          gap={'1rem'}
        >
          <GridItem area={'info'}>
            <Text>
              {'Please enter the email address used with your account'}
            </Text>
          </GridItem>
          <GridItem area={'username'}>
            <InputText
              label={'Email address'}
              field={'username'}
              value={state.username}
              placeholder={'Enter your email address'}
              change={handleChange}
              width={'50vh'}
            />
          </GridItem>
          <GridItem area={'submit'}>
            <ActionSubmit
              label={'Request password'}
              disabled={state.username.length === 0}
              isLoading={loading}
              marginTop={'1rem'}
              width={'50vh'}
            />
          </GridItem>
          <GridItem area={'forgot'}>
            <Button
              variant={'link'}
              onClick={() => navigate('login', { state: state })}
              color={'orange'}
              marginTop={'0.25rem'}
            >
              {'Back to login'}
            </Button>
          </GridItem>
        </Grid>
      </Container>
    </form>
  )
}

export default ForgotStart
