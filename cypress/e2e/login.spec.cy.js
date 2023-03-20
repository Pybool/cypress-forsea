describe('/login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('greets with Log in', () => {
    cy.contains('h1', 'Log in')
  })

  it('has forgot button', () => {
    cy.findByRole('button', { name: /Forgot password?/i }).should('exist')
  })

  // it('requires username', () => {
  //   cy.findByLabelText(/Email address/i).click()
  //   cy.contains('Username is required')
  // })

  // it('requires password', () => {
  //   cy.findByLabelText(/Password/i).type(`${Cypress.env('E2E_EMAIL')}{enter}`)
  //   cy.contains('Password is required')
  // })

  // it('requires valid email and password', () => {
  //   cy.findByLabelText(/Email address/i).type('not-an-email')
  //   cy.findByLabelText(/Password/i).type('invalid{enter}')
  //   cy.contains('Email or password is invalid')
  // })

  it('redirects to /dashboard on successful login', () => {
    cy.findByLabelText(/Email address/i).type(
      Cypress.env('CYPRESS_E2E_USERNAME'),
    )
    cy.findByLabelText(/Password/i).type(
      `${Cypress.env('CYPRESS_E2E_PASSWORD')}{enter}`,
    )
    cy.url().should('contain', '/dashboard')
  })
})
