
import {
  Then,
  When,
} from 'cypress-cucumber-preprocessor/steps'
import * as helper from '../../../functions/helper'
// const cy = cy
// const Cypress = Cypress
const formElements = {'First name': 'Taye',
  'Last name': 'Oyelekan',
  'Phone number': '0800000000',
  'Email': 'taye.oyelekan@ticknovate.com',
  'Confirm Email': 'taye.oyelekan@ticknovate.com',
}

When('correct detail is entered in the \'details page\'', () => {

  Object.keys(formElements).forEach((formElement)=>{
    const key = formElement
    const text = formElements[key].toString()
    cy.get(`input[placeholder='${formElement}']`, {timeout: 40000}).type(text)
  })

  helper.selectedTermsConditions()
  helper.selectedNewletter()
  helper.dispalyedDetailsPage()
})

function getMakePaymentButton() {
  return cy.get('div[area=\'options\']', {timeout: 40000})
    .children().eq(2)
    .find('button')
}

Then('\'Make Payment\' button is active', () => {
  getMakePaymentButton().should('have.css', 'background-color', 'rgb(0, 32, 64)')
})

When('\'Make Payment\' button is clicked', () => {
  getMakePaymentButton().click({force: true})
})

Then('\'Make Payment\' button is clicked', () => {
  getMakePaymentButton().click({force: true})
})

Then('\'Payment Details\' page displays', () => {
  cy.contains('h1', 'Book your journey')
    .siblings()
    .eq(1)
    .children()
    .eq(2).invoke('text').then((txt)=>{
      expect(txt.includes('MakePayment')).to.be.true
    })
  cy.contains('h2', 'Payment Details', {timeout: 40000}).should('exist').and('be.visible')
})

Then('\'Payment Details\' contains Add card radio button, Card number ,expiry, CVC', () => {
  cy.iframe('#nets-checkout-iframe').find('form').as('paymentform')

  cy.get('@paymentform').find('input[id=\'addCard\']').as('addcardInput')

  cy.get('@addcardInput').should('exist').and('be.visible')

  cy.get('@addcardInput').siblings().eq(0).should('contain', 'Add card')

  cy.get('@paymentform').find('div[id=\'CreditCardNumber\']').should('exist')

  cy.get('@paymentform').find('div[id=\'CreditCardNumber\']').siblings().eq(1).should('contain', 'Card number')

  cy.get('@paymentform').find('div[id=\'cardAdditionalFormInput\']').find('div[id=\'text-box\']').should('exist')

  cy.get('@paymentform').find('div[id=\'cardAdditionalFormInput\']').find('div[id=\'text-box\']').siblings().eq(1).should('contain', 'Expiry (mm/yy)')

  cy.get('@paymentform').find('div[id=\'cardAdditionalFormInput\']').children().eq(1).find('div[id=\'text-box\']').should('exist')

  cy.get('@paymentform').find('div[id=\'cardAdditionalFormInput\']').children().eq(1).find('div[id=\'text-box\']').siblings().eq(1).should('contain', 'CVC')
})


