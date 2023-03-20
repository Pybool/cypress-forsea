import React, { useState } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import {
  Grid,
  GridItem,
  Heading,
  Container,
  Text,
  useToast,
} from '@chakra-ui/react'

import InputText from './components/InputText'
import InputPassword from './components/InputPassword'
import ActionSubmit from './components/ActionSubmit'

import { forgotConfirm } from '@harmony/api/user'

import { login_action_map } from './routes'

const layout = `
  'info'
  'username'
  'code'
  'password'
  'match'
  'submit'
`

const checkValid = (state) => {
  const { username, code, password, match } = state

  const valid =
    username.length > 0 &&
    code.length > 0 &&
    password.length > 0 &&
    match.length > 0 &&
    password === match

  return valid
}

const ForgotConfirm = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [state, setState] = useState({
    username: '',
    code: '',
    password: '',
    match: '',
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
      await forgotConfirm(state)

      toast({
        title: 'Password reset successful',
        status: 'success',
        isClosable: true,
      })

      navigate('/login', { state: { username: state.username } })
    } catch (error) {
      console.log('ERROR', error)

      const { type, message } = error

      if (login_action_map[type]) {
        setLoading(false)

        message &&
          toast({
            title: message,
            status: 'error',
            isClosable: true,
          })

        return
      }

      if (type === 'GENERIC' || type === 'CODE_MISMATCH') {
        message &&
          toast({
            title: message,
            status: 'error',
            isClosable: true,
          })

        setLoading(false)

        return
      }

      toast({
        title: 'An unknown error has occured',
        status: 'error',
        isClosable: true,
      })

      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container centerContent maxWidth={'70vw'}>
        <Heading as={'h2'}>{'Confirm password reset'}</Heading>
        <Grid
          templateAreas={layout}
          justifyItems={'center'}
          padding={'2rem'}
          gap={'1rem'}
        >
          <GridItem area={'info'}>
            <Text>
              {'Reset your password with the code sent to you in the email'}
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
          <GridItem area={'code'}>
            <InputText
              label={'Reset code'}
              field={'code'}
              value={state.code}
              placeholder={'Enter your reset code'}
              change={handleChange}
              width={'50vh'}
            />
          </GridItem>
          <GridItem area={'password'}>
            <InputPassword
              label={'New Password'}
              field={'password'}
              value={state.password}
              placeholder={'Enter your new password'}
              change={handleChange}
              width={'50vh'}
            />
          </GridItem>
          <GridItem area={'match'}>
            <InputPassword
              label={'Enter your new password again'}
              field={'match'}
              value={state.match}
              placeholder={'Enter your new password again'}
              change={handleChange}
              width={'50vh'}
              isInvalid={state.password !== state.match}
            />
          </GridItem>
          <GridItem area={'submit'}>
            <ActionSubmit
              label={'Log in'}
              disabled={!checkValid(state)}
              isLoading={loading}
              marginTop={'1rem'}
              width={'50vh'}
            />
          </GridItem>
        </Grid>
      </Container>
    </form>
  )
}

export default ForgotConfirm
