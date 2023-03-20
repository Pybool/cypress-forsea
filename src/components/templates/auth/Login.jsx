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
import InputPassword from './components/InputPassword'
import ActionSubmit from './components/ActionSubmit'

import { storageManager } from '@harmony/libs/storage'
import { getApp } from '@harmony/libs/permissionHelpers'

import { login as loginAPI, getProfile } from '@harmony/api/user'

import { login_action_map } from './routes'

const storage = storageManager()

const layout = `
  'info'
  'username'
  'password'
  'submit'
`

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [state, setState] = useState({
    username: '',
    password: '',
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
      const response = await loginAPI(state)

      const { type, session, ...data } = response

      if (login_action_map[type]) {
        setLoading(false)

        const payload = {
          username: state.username,
        }

        if (session) {
          payload.session = session
        }

        navigate(login_action_map[type], { state: payload })
      } else {
        storage.set('user', {
          ...data,
        })

        const profile = await getProfile()

        const { roles } = profile

        const app = getApp(roles)

        if (app == null) {
          storage.clear()

          toast({
            title: 'You do not have access to this app.',
            status: 'error',
            isClosable: true,
          })

          setLoading(false)

          return false
        }

        storage.set('user', {
          ...data,
          ...profile,
        })

        setLoading(false)

        navigate('/', { replace: true })
      }
    } catch (error) {
      console.log('ERROR', error)

      toast({
        title: 'Incorrect username or password.',
        status: 'error',
        isClosable: true,
      })

      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container centerContent maxWidth={'70vw'}>
        <Heading as={'h1'}>{'Log in'}</Heading>
        <Grid
          templateAreas={layout}
          justifyItems={'center'}
          padding={'2rem'}
          gap={'1rem'}
        >
          <GridItem area={'info'}>
            <Text>
              {
                'Login to Harmony using the account details provided by your manager'
              }
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
          <GridItem area={'password'}>
            <InputPassword
              label={'Password'}
              field={'password'}
              value={state.password}
              placeholder={'Enter your password'}
              change={handleChange}
              width={'50vh'}
            />
            <Button
              variant={'link'}
              onClick={() => navigate('/forgot', { state: state })}
              display={'flex'}
              color={'orange'}
              marginTop={'0.25rem'}
              marginLeft={'auto'}
            >
              {'Forgot password?'}
            </Button>
          </GridItem>
          <GridItem area={'submit'}>
            <ActionSubmit
              label={'Log in'}
              disabled={
                state.username.length === 0 || state.password.length === 0
              }
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

export default Login
