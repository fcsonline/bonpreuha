const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.compraonline.bonpreuesclat.cat/',
    specPattern: 'cypress/**.cy.js',
    supportFile: false,
  },
  video: false,
  screenshotOnRunFailure: false,
  env: {
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    PRODUCT: process.env.PRODUCT,
  },
  chromeWebSecurity: false,
})
