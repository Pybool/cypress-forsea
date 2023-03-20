import elven from '@harmony/config/elven'

describe('area landing', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/area/elven')
  })

  it('display elven bazaar landing screen', () => {
    cy.contains(/I work at the elven bazaar/i).should('exist')
  })

  it('display elven bazaar options', () => {
    cy.findAllByRole('link', { name: /(?:scan|search)/i }).should(
      'to.have.lengthOf',
      Object.values(elven.landing).length,
    )
  })
})
