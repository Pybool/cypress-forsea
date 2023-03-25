import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
const cucumber = require('cypress-cucumber-preprocessor').default
  
Username: 
Password: 

module.exports = defineConfig({
  projectId: '6ys49g',
  e2e: {

    setupNodeEvents(on) {
      on('file:preprocessor', cucumber())
    },
    retries:{
      runMode:1,
      openMode:1
    },
    defaultCommandTimeout:60000,
    chromeWebSecurity:false,
    videoCompression: false,
    specPattern: "**/*.feature",
    baseUrl: 'https://forsea-int.b2c.ticknovate-uat.com',
    env: {
      VITE_GATEWAY_URL: process.env.VITE_GATEWAY_URL,
      CYPRESS_E2E_USERNAME: process.env.CYPRESS_E2E_USERNAME,
      CYPRESS_E2E_PASSWORD: process.env.CYPRESS_E2E_PASSWORD,
    },
    viewportHeight: 700,
    viewportWidth: 1240,
  },
})
