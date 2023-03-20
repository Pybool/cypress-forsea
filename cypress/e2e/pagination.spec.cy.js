import orders from '@harmony/data/orders'

describe('Pagination', () => {
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

  it('change page size', () => {
    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 10)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 3)

    cy.findByRole('button', { name: '10' }).click()
    cy.findByRole('menuitem', { name: '100' }).click()

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 100)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 2)

    cy.findByRole('button', { name: '100' }).click()
    cy.findByRole('menuitem', { name: '50' }).click()

    cy.findAllByText(/DVO/i).should('to.have.lengthOf', 50)
    cy.findAllByTestId('pager-item').should('to.have.lengthOf', 3)
  })

  it('display page', () => {
    cy.findByRole('button', { name: 'Previous' }).should('be.disabled')
    cy.findByRole('button', { name: '1' }).should('be.disabled')
    cy.findByRole('button', { name: '2' }).should('not.be.disabled')
    cy.findByRole('button', { name: '3' }).should('not.be.disabled')
    cy.findByRole('button', { name: 'Next' }).should('not.be.disabled')
  })

  it('go to next page', () => {
    cy.window()
      .its('sessionStorage')
      .invoke(
        'setItem',
        'TICKNOVATE',
        JSON.stringify({
          searchGuestFilters: {},
          paginateGuests: {
            page: 2,
            pageSize: 10,
          },
        }),
      )
      .then(() => {
        cy.visit('/area/elven/guests')

        cy.findByRole('button', { name: 'Next' }).click()

        cy.findByRole('button', { name: 'Previous' }).should('not.be.disabled')
        cy.findByRole('button', { name: '1' }).should('not.be.disabled')
        cy.findByRole('button', { name: '2' }).should('not.be.disabled')
        cy.findByRole('button', { name: '3' }).should('be.disabled')
        cy.findByRole('button', { name: 'Next' }).should('not.be.disabled')
      })
  })

  it('go to previous page', () => {
    cy.window()
      .its('sessionStorage')
      .invoke(
        'setItem',
        'TICKNOVATE',
        JSON.stringify({
          searchGuestFilters: {},
          paginateGuests: {
            page: 3,
            pageSize: 10,
          },
        }),
      )
    cy.visit('/area/elven/guests')

    cy.findByRole('button', { name: 'Previous' }).click()

    cy.findByRole('button', { name: 'Previous' }).should('not.be.disabled')
    cy.findByRole('button', { name: '1' }).should('not.be.disabled')
    cy.findByRole('button', { name: '2' }).should('be.disabled')
    cy.findByRole('button', { name: '3' }).should('not.be.disabled')
    cy.findByRole('button', { name: 'Next' }).should('not.be.disabled')
  })

  it('go to a specific page', () => {
    cy.findByRole('button', { name: '3' }).click()

    cy.findByRole('button', { name: 'Previous' }).should('not.be.disabled')
    cy.findByRole('button', { name: '1' }).should('not.be.disabled')
    cy.findByRole('button', { name: '2' }).should('not.be.disabled')
    cy.findByRole('button', { name: '3' }).should('be.disabled')
    cy.findByRole('button', { name: 'Next' }).should('not.be.disabled')
  })

  it('go to the last page', () => {
    cy.intercept(`${Cypress.env('VITE_GATEWAY_URL')}/orders`, orders).as(
      'orders',
    )

    cy.window()
      .its('sessionStorage')
      .invoke(
        'setItem',
        'TICKNOVATE',
        JSON.stringify({
          searchGuestFilters: {},
          paginateGuests: {
            page: 12,
            pageSize: 10,
          },
        }),
      )
    cy.visit('/area/elven/guests')

    cy.findByRole('button', { name: 'Next' }).click()

    cy.findByRole('button', { name: 'Previous' }).should('not.be.disabled')
    cy.findByRole('button', { name: '13' }).should('be.disabled')
    cy.findByRole('button', { name: 'Next' }).should('be.disabled')
  })
})
