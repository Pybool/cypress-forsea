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

import storage from '@harmony/libs/storage'
import { getApp } from '@harmony/libs/permissionHelpers'

import { challenge, getProfile } from '@harmony/api/user'

const layout = `
  'info'
  'username'
  'password'
  'submit'
`

const Challenge = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [state, setState] = useState({
    username: '',
    session: '',
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
      const response = await challenge({
        ...state,
        challenge: 'NEW_PASSWORD_REQUIRED',
      })

      const { type, ...data } = response

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

        return
      }

      storage.set('user', {
        ...data,
        ...profile,
      })

      setLoading(false)

      navigate('/', { replace: true })
    } catch (error) {
      console.error('ERROR', error)

      toast({
        title: error.message || 'You have submitted an invalid password.',
        status: 'error',
        isClosable: true,
      })

      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container centerContent maxWidth={'70vw'}>
        <Heading as={'h2'}>{'New account creation'}</Heading>
        <Grid
          templateAreas={layout}
          justifyItems={'center'}
          padding={'2rem'}
          gap={'1rem'}
        >
          <GridItem area={'info'}>
            <Text>
              {
                'We have detected that you have a temporary password, please submit a new password to proceed.'
              }
            </Text>
          </GridItem>
          <GridItem area={'username'}>
            <InputText
              label={'Username'}
              field={'username'}
              value={state.username}
              placeholder={'Username'}
              change={handleChange}
              width={'50vh'}
            />
          </GridItem>
          <GridItem area={'password'}>
            <InputPassword
              label={'Password'}
              field={'password'}
              value={state.password}
              placeholder={'Password'}
              change={handleChange}
              width={'50vh'}
            />
          </GridItem>
          <GridItem area={'submit'}>
            <ActionSubmit
              label={'Set password'}
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

export default Challenge
