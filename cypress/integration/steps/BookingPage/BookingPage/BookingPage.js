
import {Then, When} from 'cypress-cucumber-preprocessor/steps'
import {
  openFieldModal,
  selectModalOption,
  clickModalButton,
  selectModalHorizontalOption,
} from '../../../functions/helper'

// const { cy } = require('cypress');

Then('the {string} field is {string} in the Booking Page', (button, mode) => {
  let baseColor
  switch (mode) {
    case 'orange':
      baseColor = 'rgb(224, 80, 32)'
      break
    case 'greyed out':
      baseColor = 'rgb(203, 203, 203)'
      break
    case 'active-green':
      baseColor = 'rgb(112, 192, 160)'
      break
    default:
      baseColor = 'rgb(203, 203, 203)'
  }
  cy.get('button[class^="button_button_"]').contains(button).should('have.css', 'color', baseColor)
})
Then('I click the {string} field in the Booking Page', (button) => {
  openFieldModal(button)
})

Then('the {string} should be inactive and maintains green CSS', (name) => {
  const menuName = name.split(' ')
  cy
    .get('div[class*="row_spread_"]')
    .get('div[class*="row_layout_"]')
    .get('div[class*="column_layout_"]')
    .contains(menuName[0])
    .should('have.css', 'color', 'rgb(112, 192, 160)')
  cy
    .get('div[class*="row_spread_"]')
    .get('div[class*="row_layout_"]')
    .get('div[class*="column_layout_"]')
    .contains(menuName[1])
    .should('have.css', 'color', 'rgb(112, 192, 160)')
})

Then('The {string} should be displayed in BOOKING SUMMARY', (name) => {
  cy
    .get('div[class*="summary_layout_"]')
    .contains(name)
    .should('be.visible')
})

Then('The {string} heading is displayed on the top left hand side', (name) => {
  cy
    .get('div[class*="row_spread_"]')
    .get('div')
    .get('h1')
    .contains(name)
})
When('user click the back arrow button on booking page', function() {
  cy
    .get('div[class*="row_spread_"]')
    .get('div[class*="row_layout_"]')
    .get('button[class*="flexbutton_button_"]')
    .click()
})
Then('I should see {string} modal in Booking Page', (name) => {
  cy
    .get('#portal')
    .get('div[class*="modal_caddy_"]')
    .get('h2[class*="heading_heading_"]')
    .contains(name)
    .should('be.visible')
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
When('the {string} and {string} fields are populated on the To and From field', (from, to)=>{
  openFieldModal('From')
  selectModalOption(from)
  clickModalButton('Next')
  selectModalOption(to)
  clickModalButton('Done')
})

