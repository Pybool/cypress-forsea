import '@testing-library/cypress/add-commands'

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('VITE_GATEWAY_URL')}/users/login`,
    form: false,
    body: {
      username: Cypress.env('CYPRESS_E2E_USERNAME'),
      password: Cypress.env('CYPRESS_E2E_PASSWORD'),
    },
  })
    .its('body')
    .then((loginData) => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('VITE_GATEWAY_URL')}/me/profile`,
        form: false,
        headers: {
          Authorization: loginData.accessToken,
        },
      })
        .its('body')
        .then((profileData) => {
          window.localStorage.setItem(
            'TICKNOVATE',
            JSON.stringify({
              user: {
                ...loginData,
                ...profileData,
              },
            }),
          )
        })
    })
})
