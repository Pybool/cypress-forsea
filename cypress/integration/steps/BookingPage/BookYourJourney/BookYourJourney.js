
import {Then, When} from 'cypress-cucumber-preprocessor/steps'
import {openFieldModal, selectModalOption, clickModalButton, selectModalHorizontalOption, blockingWait} from '../../../functions/helper'
const { Cypress, cy } = require('cypress');

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
    case 'navy-blue':
      baseColor = 'rgb(0, 32, 64)'
      break
    default:
      baseColor = 'rgb(203, 203, 203)'
  }
  cy.get('button[class^="button_button_"]').contains(button).should('have.css', 'color', baseColor)
})
Then('the {string} field has {string} background in the Booking Page', (button, mode) => {
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
    case 'navy-blue':
      baseColor = 'rgb(0, 32, 64)'
      break
    default:
      baseColor = 'rgb(203, 203, 203)'
  }
  cy.get('button[class^="button_button_"] span').contains(button).closest('button').should('have.css', 'background-color', baseColor)
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
Then('The {string} should not be displayed in BOOKING SUMMARY', (name) => {
  cy
    .get('div[class*="summary_layout_"]')
    .contains('Ticket Price')
    .should('be.visible')
  cy.log(name)
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
When('I select {string} from the vehicle modal', (vehicleType) => {
  openFieldModal('Travel')
  selectModalHorizontalOption('Vehicle')
  selectModalOption(vehicleType)
  clickModalButton('Done')
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
When('I select Date and Ticket on the modal', async()=>{
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    cy.log(err,runnable)
    return false
  })
  openFieldModal('Date')
  cy.get('#portal div[class*=\'datecell_available_\']', {timeout: 40000})
    .eq(0).click({force: true})
  cy.get('#portal button span')
    .contains('Next')
    .click({force: true})
  cy.get('#portal div[class*=\'datetile_list_\'] div[class*=\'ticket_layout_\'] p')
    .contains('Single Journey')
    .click({force: true})
    await blockingWait(5000)
  cy.get('div[id=\'portal\'] div[class*=\'row_spread_\'] button[class*=\'button_button_\'] span')
    .contains('Done')
    .click({force: true})
    await blockingWait(5000)
})
When('the Route section and VISITORS options is populated', () => {
  openFieldModal('Visitors')
  cy.get('#portal')
    .get('input[id=\'ticket[0]qty\']')
    .parent('div[class*="fieldwrapper_layout_"]')
    .siblings('button').eq(1).click()
  clickModalButton('Done')
})

