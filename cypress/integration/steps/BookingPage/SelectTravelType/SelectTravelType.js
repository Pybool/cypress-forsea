
import {Then, When} from 'cypress-cucumber-preprocessor/steps'
import {openFieldModal, selectModalOption, clickModalButton, selectModalHorizontalOption} from '../../../functions/helper'
// const { cy } = require('cypress')

Then('I click the {string} field in the Booking Page', (button) => {
  openFieldModal(button)
})


Then('The {string} heading is displayed on the top left hand side', (name) => {
  cy
    .get('div[class*="row_spread_"]')
    .get('div')
    .get('h1')
    .contains(name)
})

Then('I select {string} from the list', (selectedName) => {
  selectModalOption(selectedName)
})
Then('I select {string} from the box list', (selectedName) => {
  selectModalHorizontalOption(selectedName)
})
Then('I click {string} button from the modal', (selectedName) => {
  clickModalButton(selectedName)
})
When('the {string} and {string} fields are populated on the To and From field', (from, to) => {
  openFieldModal('From')
  selectModalOption(from)
  clickModalButton('Next')
  selectModalOption(to)
  clickModalButton('Done')
})
