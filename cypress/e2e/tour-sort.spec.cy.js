describe('Tour Sorting', () => {
  before(() => {
    cy.intercept(`${Cypress.env('VITE_GATEWAY_URL')}/orders`).as('orders')
    cy.intercept(`${Cypress.env('VITE_GATEWAY_URL')}/orders/**/extensions`).as(
      'extensions',
    )
  })

  beforeEach(() => {
    cy.login()
    cy.visit('/area/woodland/tours')
  })

  it('display woodland tour sorting', () => {
    cy.contains(/Tour Sorting/i).should('exist')
  })

  it('display woodland tour sorting options', () => {})
})
