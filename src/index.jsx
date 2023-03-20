import React from 'react'
import ReactDOM from 'react-dom/client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import { version } from '../package.json'

import DefaultTheme from '../src/themes/default'

import App from './App'

import { datadogRum } from '@datadog/browser-rum'

datadogRum.init({
  applicationId: import.meta.env.VITE_DATADOG_RUM_APPLICATION_ID,
  clientToken: import.meta.env.VITE_DATADOG_RUM_CLIENT_ID,
  site: 'datadoghq.eu',
  service: 'harmony',
  version,
  sampleRate: 100,
  sessionReplaySampleRate: 20,
  trackInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
})

datadogRum.startSessionReplayRecording()

const theme = extendTheme(DefaultTheme)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
