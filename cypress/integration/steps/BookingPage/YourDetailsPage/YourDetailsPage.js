import {
  And,
  Then,
  When,
} from 'cypress-cucumber-preprocessor/steps'
import * as helper from '../../../functions/helper'
// const { cy } = require('cypress')


const buttonsSelector = 'button[class^="button_button_"]'
const returnDateSelector = 'h3:contains(Return Date)'
const addReturnButtonSelector = `${buttonsSelector}:contains(Add Return)`
const formElements = ['First name', 'Last name', 'Phone number', 'Email', 'Confirm Email']
const longtimeout = 40000
const timeout = 40000

Then('\'YOUR DETAILS\' page displays', () => {
  cy.contains('h1', 'Book your journey')
    .siblings()
    .eq(1)
    .children()
    .eq(1).invoke('text').then((txt)=>{
      expect(txt.includes('YourDetails')).to.be.true
    })
})

Then('\'Booking Summary\' section matches booking information', () => {
  const bookingInfo = {
    from: 'Sweden, Helsingborg',
    to: 'Denmark, Elsinor',
    adultsCount: 'x1',
    vehicleCount: 'x1',
    vehicleType: 'Car under 6 meter',
    journeyType: 'Single Journey',
    price: helper.storage('price', null, 'read'),
  }

  cy.get('div[class^="summary_layout_"]').as('summary')
  cy.get('@summary').find('span').contains('Ticket Price').as('ticketprice')
  cy.get('@ticketprice').siblings().eq(0).invoke('text').then((txt)=>{
    expect(bookingInfo.price).to.includes(txt)
  })
  const to = bookingInfo.to.split(',')[1].trim()
  const from = bookingInfo.from.split(',')[1].trim()
  cy.get('@summary').children().eq(2).as('summaryabbr')

  cy.get('@summaryabbr')
    .find('span').eq(0)
    .should('contain', from)
    .and('contain', to)

  cy.get('@summaryabbr')
    .find('span').eq(1)
    .should('have.text', bookingInfo.journeyType)

  cy.get('@summaryabbr')
    .find('div').eq(0).find('div')
    .eq(0).find('span')
    .contains(bookingInfo.adultsCount)
    .should('exist')
    .and('be.visible')

  cy.get('@summaryabbr')
    .find('div').eq(0).find('div')
    .eq(1).find('span').eq(1).should('have.text', bookingInfo.vehicleCount)
})

Then('\'Booking Summary\' section matches booking information for round trip', () => {
  const bookingInfo = {
    from: 'Sweden, Helsingborg',
    to: 'Denmark, Elsinor',
    adultsCount: 'x1',
    vehicleCount: 'x1',
    vehicleType: 'Car under 6 meter',
    journeyType: 'Round trip',
    price: helper.addCurrencyStrings(helper.storage('price', null, 'read'), helper.storage('return-price', null, 'read')),
  }

  cy.get('div[class^="summary_layout_"]').as('summary')
  cy.get('@summary').find('span').contains('Ticket Price').as('ticketprice')
  cy.get('@ticketprice').siblings().eq(0).invoke('text').then(async (txt)=>{
    cy.log(bookingInfo.price, txt)
    cy.wait(3000)
  })
  const to = bookingInfo.to.split(',')[1].trim()
  const from = bookingInfo.from.split(',')[1].trim()
  cy.get('@summary').children().eq(3).as('summaryabbr')

  cy.get('@summaryabbr')
    .find('span').eq(0)
    .should('contain', from)
    .and('contain', to)

  cy.get('@summaryabbr')
    .find('span').eq(1)
    .should('contain', bookingInfo.journeyType)

  cy.get('@summaryabbr')
    .find('div').eq(0).find('div')
    .eq(0).find('span')
    .contains(bookingInfo.adultsCount)
    .should('exist')
    .and('be.visible')

  cy.get('@summaryabbr')
    .find('div').eq(0).find('div')
    .eq(1).find('span').eq(1).should('have.text', bookingInfo.vehicleCount)
})

And('\'Return\' section is completed', async () => {
  cy.get(addReturnButtonSelector, {timeout: timeout})
    .closest('button')
    .click({force: true})

  cy.get(returnDateSelector, {timeout: timeout})
    .next()
    .should('be.visible')

  cy.get('#portal div[class*=\'datecell_available_\']', {timeout: longtimeout})
    .eq(2).as('selected')
  cy.get('@selected').invoke('text').then((txt)=>{
    cy.log(txt)
    helper.storage('return-price', txt.split('From')[1], 'write')
  })
  cy.get('@selected').click({force: true})
  cy.get('#portal button span')
    .contains('Next')
    .click({force: true})

  cy.get('#portal div[class*=\'datetile_list_\'] div[class*=\'ticket_layout_\'] p')
    .contains('Round trip')
    .click({force: true})
  cy.wait(3000)
  cy.get('div[id=\'portal\'] div[class*=\'row_spread_\'] button[class*=\'button_button_\'] span')
    .contains('Done')
    .click({force: true})
  cy.wait(3000)
})


Then('\'YOUR DETAILS\' page displays with six \'<Text>\' boxes', () => {
  for (let i = 0; i < formElements.length; i++) {
    cy.get(`input[placeholder*='${formElements[i]}']`, {timeout: longtimeout}).should('exist').and('be.visible')
  }
})

Then('\'YOUR DETAILS\' page displays with two <check boxes>', () => {
  helper.dispalyedDetailsPage()
})

And('\'Make Payment\' button is highlighted in red', () => {
  cy.get('button[class*=\'button_warning_\']', {timeout: longtimeout})
    .find('span').contains('Make payment').should('have.css', 'color', 'rgb(224, 80, 32)')
})

When('I click inside a \'Text Box\' and clcik in the next input the \'* Required field\' message is displayed', () => {
  const len = formElements.length-1
  for (let i = 0; i < len; i++) {
    cy.get(`input[placeholder*='${formElements[i]}']`, {timeout: longtimeout}).as('input')
    cy.get(`input[placeholder*='${formElements[i+1]}']`, {timeout: longtimeout}).as('nextinput')
    cy.get('@nextinput').eq(0).click()
    if (i > 0 && i < len-1) {
      cy.get('@input').
        siblings().eq(2)
        .contains('* Required field')
        .should('exist')
        .and('be.visible')
    }
  }
  // })
})


When('I enter {string} in {string} field text Box', (wrongInfo, field) => {
  // cy.visit('/details').then(()=>{
  cy.get(`input[placeholder='${field}']`, {timeout: longtimeout}).type(wrongInfo.trim())
  // })
})


And('I tick \'I approve ForSea Ferries terms and conditions and privacy policy\' Checkbox', () => {
  helper.selectedTermsConditions()
})

Then('\'Please fill in the required items\' message is displayed', () => {
  cy.get('div[area=\'options\']', {timeout: longtimeout}).as('optionsdiv')
  cy.get('@optionsdiv').children().as('divoptionschildren')
  cy.get('@divoptionschildren')
    .eq(2)
    .find('p')
    .contains('Please fill in the required items')
    .should('exist')
    .and('be.visible')
  // cy.wait(50000)
})


