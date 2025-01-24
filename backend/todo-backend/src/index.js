require('dotenv').config({ path: '../.env' })
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const route  = require('./routers/index')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use('/api', route) 

module.exports = app  