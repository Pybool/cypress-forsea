
import {Then, When} from 'cypress-cucumber-preprocessor/steps'
// const { cy } = require('cypress')

Then('I enter an {string} promotional code', (invalidCode) => {
  cy.log(invalidCode)
})

Then('the \'Add\' button becomes active', () => {
  cy.log('.')
})

When('I click \'Add\' button', () => {
  cy.log('.')
})

Then('the error displays, {string}', (errorMessage) => {
  cy.log(errorMessage)
})
