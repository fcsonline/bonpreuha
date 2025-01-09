const express = require('express')
const { exec } = require('child_process')

const app = express()

// Reusable sanitization function
const sanitizeInput = (input) => {
    if (!input) return ''
    return input.replace(/[^a-zA-Z0-9_-]/g, '')
}

app.get('/healthcheck', (req, res) => {
    res.json({ ok: true })
})

app.get('/add', (req, res) => {
    const { product } = req.query
    if (!product) {
        return res.status(400).json({ error: 'Missing product query parameter' })
    }

    const sanitizedProduct = sanitizeInput(product)
    const command = `PRODUCT="${sanitizedProduct}" cypress run --e2e /e2e/cypress/bonpreu.cy.js`

    exec(command, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: stderr })
        }
        res.json({ message: stdout.trim() })
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
