Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

const username = Cypress.env('USERNAME')
const password = Cypress.env('PASSWORD')
const product = Cypress.env('PRODUCT')

// NOTE: Review this cypress bug https://github.com/cypress-io/cypress/issues/25373
describe('Add product Bonpreu Online Store', () => {
  it('Scrapes product information', () => {
    if (!username || !password || !product) {
      throw new Error('Missing required information')
    }

    cy.visit('/')

    cy.get('#onetrust-accept-btn-handler').click() // Accept cookies

    cy.intercept('POST', '/recaptcha/api/siteverify', { success: true })

    cy.get('a[href="/login"]').first().click()

    cy.origin('https://app.bonpreu.cat', () => {
      const username = Cypress.env('USERNAME')
      const password = Cypress.env('PASSWORD')

      Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })

      cy.visit('/openid-connect-server-webapp/login?lang=ca-ES&channel=osp', {
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        }
      }) // Navigate to the login page

      cy.window().then((win) => {
        expect(win.grecaptcha).to.exist // Ensure reCAPTCHA is loaded
      });

      cy.get('input[name="username"]').type(username)
      cy.get('input[name="password"]').type(password)
      cy.get('input[type="submit"]').click()
    })

    cy.visit('/') // Navigate
    cy.get('form[role="search"]').within(() => {
      cy.wait(2000)
      cy.get('input[name="q"]').type(product) // Search product
      cy.wait(3000)
      cy.get('button[type="submit"]').click()
    })

    cy.contains('Afegeix').first().scrollIntoView().click() // Add product
  })
})
