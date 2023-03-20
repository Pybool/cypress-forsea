describe('tour link', () => {
  before(() => {
    cy.intercept(`${Cypress.env('VITE_GATEWAY_URL')}/orders`).as('orders')
  })

  beforeEach(() => {
    cy.login()
    cy.visit('/area/woodland/tours')

    cy.wait('@orders').then(() => {
      cy.findByLabelText(/Group linking/i).check({ force: true })
    })
  })

  it('display tour linking', () => {
    cy.contains('Tour Sorting').should('exist')
  })
})
