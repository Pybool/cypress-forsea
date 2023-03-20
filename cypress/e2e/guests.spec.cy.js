describe('guests', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/area/elven/guests')
  })

  afterEach(() => {
    // set default filter to blank
    window.sessionStorage.setItem(
      'TICKNOVATE',
      JSON.stringify({
        searchGuestFilters: {},
        paginateGuests: {
          page: 1,
          pageSize: 10,
        },
      }),
    )
  })

  it('display elven bazaar guests screen', () => {
    cy.contains(/Search Guests/i).should('exist')
  })

  it('display elven bazaar guests screen with search results', () => {
    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 10)
    cy.findByTestId('per-page').should('include.text', '10')
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 3)
  })

  it('display elven bazaar guests screen with no search results', () => {
    cy.findByLabelText(/Search:/i).type('not-a-real-result{enter}')

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 0)
    cy.findByTestId('per-page').should('include.text', '10')
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 1)
  })
})
