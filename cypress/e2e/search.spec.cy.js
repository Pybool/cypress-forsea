describe('Search', () => {
  beforeEach(() => {
    cy.login()

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

    cy.visit('/area/elven/guests')
  })

  it('filter search results by name', () => {
    cy.findByLabelText(/Search:/i).type('Scott{enter}')

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 10)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 3)
  })

  it('filter search results by order ref', () => {
    cy.findByLabelText(/Search:/i).type('DVO6{enter}')

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 6)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 1)
  })

  it('filter search results by date range', () => {
    const currMonth = Intl.DateTimeFormat('en-GB', {
      month: 'long',
    }).format(Date.now())
    const currYear = new Date().getFullYear()
    const chosenYear = '2022'
    const chosenMonth = 'November'
    const chosenDay = '24'

    cy.findByLabelText(/Date range:/i).click()
    cy.findByRole('button', { name: `${currMonth} ${currYear}` }).click()
    cy.findByRole('button', { name: currYear }).click()
    cy.findByRole('button', { name: chosenYear }).click()
    cy.findByRole('button', { name: `${chosenMonth} ${chosenYear}` }).click()
    cy.findByRole('button', {
      name: `${chosenDay} ${chosenMonth} ${chosenYear}`,
    }).click()
    cy.findByRole('button', {
      name: `${chosenDay} ${chosenMonth} ${chosenYear}`,
    }).click()
    cy.findByRole('button', { name: 'Close' }).click()

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 10)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 3)
  })

  it('filter search results by time', () => {
    cy.findByLabelText(/Time:/i).select(['09:00'])

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 3)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 1)
  })

  it('filtering by date range resets time', () => {
    cy.findByLabelText(/Time:/i).select(['09:00'])

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 3)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 1)

    const currMonth = Intl.DateTimeFormat('en-GB', {
      month: 'long',
    }).format(Date.now())
    const currYear = new Date().getFullYear()
    const chosenYear = '2022'
    const chosenMonth = 'November'
    const chosenDay = '24'

    cy.findByLabelText(/Date range:/i).click()
    cy.findByRole('button', { name: `${currMonth} ${currYear}` }).click()
    cy.findByRole('button', { name: currYear }).click()
    cy.findByRole('button', { name: chosenYear }).click()
    cy.findByRole('button', { name: `${chosenMonth} ${chosenYear}` }).click()
    cy.findByRole('button', {
      name: `${chosenDay} ${chosenMonth} ${chosenYear}`,
    }).click()
    cy.findByRole('button', {
      name: `${chosenDay} ${chosenMonth} ${chosenYear}`,
    }).click()
    cy.findByRole('button', { name: 'Close' }).click()

    cy.findByLabelText(/Time:/i).its('value').should('to.be.undefined')

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 10)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 3)
  })
})
