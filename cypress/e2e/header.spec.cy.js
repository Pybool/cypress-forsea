describe('header', () => {
  it('display the header logged out', () => {
    cy.visit('/')
    cy.contains('Log out').should('not.exist')
  })

  it('display the header logged in', () => {
    cy.login()
    cy.visit('/dashboard')
    cy.contains('Log out').should('exist')
  })

  it('log out user when logout button is pressed', () => {
    // logged in from previous test
    cy.contains('Log out').should('exist')
    cy.findByRole('button', { name: /Log out/i }).click()
    cy.contains('Log out').should('not.exist')
  })
})
