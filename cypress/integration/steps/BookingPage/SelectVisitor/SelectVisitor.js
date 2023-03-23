
import {Then, When} from 'cypress-cucumber-preprocessor/steps'
import {openFieldModal, selectModalOption, clickModalButton, selectModalHorizontalOption} from '../../../functions/helper'
const { cy } = require('cypress')


When('the {string} and {string} fields are populated on the To and From field', (from, to) => {
  openFieldModal('From')
  selectModalOption(from)
  clickModalButton('Next')
  selectModalOption(to)
  clickModalButton('Done')
})
When('I select {string} from the vehicle modal', (vehicleType) => {
  openFieldModal('Travel')
  selectModalHorizontalOption('Vehicle')
  selectModalOption(vehicleType)
  clickModalButton('Done')
})
When('I click the {string} field in the Booking Page', (button) => {
  openFieldModal(button)
})
Then('I should see {string} modal in Booking page', (name) => {
  cy
    .get('#portal')
    .get('div[class*="modal_caddy_"]')
    .get('h2[class*="heading_heading_"]')
    .contains(name)
    .should('be.visible')
})
Then('I click {string} button from the modal', (selectedName) => {
  clickModalButton(selectedName)
})
Then('The {string} heading is displayed on the top left hand side', (name) => {
  cy
    .get('div[class*="row_spread_"]')
    .get('div')
    .get('h1')
    .contains(name)
})
Then('I click adult {string} button on the modal', (plus) => {
  for (let i=0; i<Number(plus); i++) {
    cy.get('#portal').get('input[id=\'ticket[0]qty\']').parent('div[class*="fieldwrapper_layout_"]').siblings('button').eq(1).click()
  }
})
Then('I click child {string} button on the modal', (plus) => {
  for (let i=0; i<Number(plus); i++) {
    cy.get('#portal').get('input[id=\'ticket[3]qty\']').parent('div[class*="fieldwrapper_layout_"]').siblings('button').eq(1).click()
  }
})
Then('the adult "+" button is greyed out and not clicakable', () => {
  cy.get('#portal').get('input[id=\'ticket[0]qty\']').parent('div[class*="fieldwrapper_layout_"]').siblings('button').eq(1).should('be.disabled')
})
Then('the child "+" button is greyed out and not clicakable', () => {
  cy.get('#portal').get('input[id=\'ticket[3]qty\']').parent('div[class*="fieldwrapper_layout_"]').siblings('button').eq(1).should('be.disabled')
})
