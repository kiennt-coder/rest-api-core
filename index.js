const express = require('express')
const helmet = require('helmet')
const createError = require('http-errors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const userRoute = require('./Routes/User.router')
const errorLogEvents = require('./helpers/logEvents')


// Create Express Application
const app = express()

// Change HTTP Headers
app.use(helmet())

// Read json 
app.use(express.json())

// Parse json to string or array
app.use(express.urlencoded({extended: true}))

// log all requests to access.log
app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, './Logs/access.log'), { flags: 'a' })
}))

// Create route home
app.use('/v1/user', userRoute)

// Create function handle error not found
app.use((req, res, next) => {
    next(createError.NotFound("This route is not exists!"))
})

// Create function response message error
app.use((err, req, res, next) => {
    errorLogEvents(`${req.url}---${req.method}---${err.status}---${err.message}`)
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message
    })
})

// Create port
const PORT = process.env.PORT || 3001;

// Listen port with Server running
app.listen(PORT, function() {
    console.log(`Server is running with Port::${PORT}!`)
})