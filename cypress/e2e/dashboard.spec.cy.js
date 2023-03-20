import config from '@harmony/config'

describe('dashboard', () => {
  before(() => {
    cy.login()
    cy.visit('/dashboard')
  })

  it('display the dashboard', () => {
    cy.findByText(/Where are you going to work today?/i).should('exist')
  })

  it('display all areas the dashboard', () => {
    Object.values(config).forEach(({ kind }) => {
      cy.findByText(kind).should('exist')
    })
  })
})
