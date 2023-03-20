describe('forgot', () => {
  it('displays reset password screen', () => {
    cy.visit('/forgot')
    cy.contains(/Reset your password/i).should('exist')
  })
})
