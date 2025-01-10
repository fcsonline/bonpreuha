const express = require('express')
const { exec } = require('child_process')

const app = express()

// Reusable sanitization function
const sanitizeInput = (input) => {
    if (!input) return ''
    return input.replace(/[^a-zA-Z0-9 _-]/g, '')
}

const stripAnsiCodes = str => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

app.get('/healthcheck', (req, res) => {
    const datetime = new Date()

    res.json({ ok: true, time: datetime.toISOString() })
})

app.get('/add', (req, res) => {
    console.log('Add handler...')
    const { product } = req.query
    if (!product) {
        return res.status(400).json({ error: 'Missing product query parameter' })
    }

    const sanitizedProduct = sanitizeInput(product)
    const command = `PRODUCT="${sanitizedProduct}" cypress run --e2e /e2e/cypress/bonpreu.cy.js`

    console.log(`Adding '${sanitizedProduct}' to the BonPreu cart...`)

    exec(command, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: stderr })
        }
        res.json({ message: stripAnsiCodes(stdout.trim()) })

        console.log(`Added '${sanitizedProduct}' to the BonPreu cart`)
    })
})

// app.get('/remove', (req, res) => {
//     const { product } = req.query
//     if (!product) {
//         return res.status(400).json({ error: 'Missing product query parameter' })
//     }

//     const sanitizedProduct = sanitizeInput(product)
//     exec(`echo "Removing product: ${sanitizedProduct}"`, (err, stdout, stderr) => {
//         if (err) {
//             return res.status(500).json({ error: stderr })
//         }
//         res.json({ message: stdout.trim() })
//     })
// })

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})
