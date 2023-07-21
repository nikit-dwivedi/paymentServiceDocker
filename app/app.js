const express = require('express')
const cors = require("cors")
const app = express()
require('./src/api/v1/config/db')
const paymentRoute = require('./src/api/v1/routes/payment.route')
const bankRoute = require('./src/api/v1/routes/bank.router')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.json())
app.use('/payment', paymentRoute)
app.use('/bank', bankRoute)
app.post('/webhook', async (req, res) => {
    console.log(req.body);
    res.send("data")
})

module.exports = app