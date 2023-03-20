import React, { useState, useEffect } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// import { useSearchParams } from 'react-router-dom'

import Splash from './Splash'
import Auth from './Auth'
import Main from './Main'

import getConfig from '@harmony/libs/getConfig'
import { storageManager } from '@harmony/libs/storage'
import { listen, STORAGE_CHANGED } from '@harmony/libs/events'
import { getApp } from '@harmony/libs/permissionHelpers'

import { login, getProfile } from '@harmony/api/user'

import { useToast } from '@chakra-ui/react'

const queryClient = new QueryClient()

const storage = storageManager()

const getParams = () => {
  const params = new URLSearchParams(window.location.search)

  const output = {}

  params.forEach((value, key) => {
    output[key] = value
  })

  return output
}

const AuthCheck = async (toast) => {
  const user = storage.get('user')

  if (!user.accessToken) {
    return false
  } else {
    try {
      const { refreshToken, username } = user

      const response = await login({
        refreshToken,
        username,
      })

      // Need a cleaner way of doing this
      storage.set('user', {
        ...user,
        ...response,
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

        return false
      }

      storage.set('user', {
        ...user,
        ...response,
        ...profile,
      })

      const app_modifiers = getParams()

      if (app_modifiers['redeem_booked_date']) {
        storage.set(
          'redeem_booked_date',
          app_modifiers['redeem_booked_date'] === 'true',
        )
      }

      return true
    } catch (error) {
      console.error('AUTH ERROR', error)

      return false
    }
  }
}

const App = () => {
  const toast = useToast()

  const [ready, setReady] = useState(false)

  const [auth, setAuth] = useState(false)

  useEffect(() => {
    getConfig()

    const checkTokenAndLogin = async () => {
      const authed = await AuthCheck(toast)

      setAuth(authed)
      setReady(true)
    }

    checkTokenAndLogin()

    const handleStorageChange = ({ type, state }) => {
      if (type === 'local') {
        if (state.user?.accessToken && state.user?.roles) {
          setAuth(true)
        } else {
          setAuth(false)
        }
      }
    }

    const unListenStorage = listen(STORAGE_CHANGED, handleStorageChange)

    return unListenStorage
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {!ready && <Splash />}
      {ready && (
        <>
          {auth && <Main />}
          {!auth && <Auth />}
        </>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
