import { useState } from 'react'

import { storageManager } from '@harmony/libs/storage'

const useSessionState = ({ key, initial = {} }) => {
  const storage = storageManager('session')

  const [state, setState] = useState({
    ...storage.get(key, initial),
  })

  const handleSync = (payload) => {
    storage.set(key, payload)

    setState(payload)
  }

  return [state, handleSync]
}

const useHybridSessionState = ({
  key,
  initialSession = {},
  initialState = {},
}) => {
  const [sessionState, setSessionState] = useSessionState({
    key,
    initial: initialSession,
  })

  const [internalState, setInternalState] = useState(initialState)

  const handleChange = (payload) => {
    const session = {}
    const internal = {}

    Object.keys(payload).forEach((key) => {
      if (sessionState.hasOwnProperty(key)) session[key] = payload[key]
      if (internalState.hasOwnProperty(key)) internal[key] = payload[key]
    })

    setSessionState({ ...sessionState, ...session })
    setInternalState({ ...internalState, ...internal })
  }

  return [
    {
      ...sessionState,
      ...internalState,
    },
    handleChange,
  ]
}

export default useSessionState

export { useHybridSessionState }
