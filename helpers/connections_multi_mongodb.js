const mongoose = require('mongoose')

function newConnection(uri) {
    // Connect to MongoDB
    const conn = mongoose.createConnection(process.env.URI_MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    // Listen connected event
    conn.on('connected', function() {
        console.log(`Mongodb:: connected::${this.name}`)
    })

    // Listen disconnect event
    conn.on('disconnected', function() {
        console.log(`Mongodb:: disconnected::${this.name}`)
    })

    // Listen error event
    conn.on('error', function(error) {
        console.log(`Mongodb:: error::${JSON.stringify(error)}`)
    })

    // Listen before close process event
    process.on('SIGINT', async() => {
        // Close connect to db
        await conn.close()
        process.exit(0)
    })

    return conn
}

const testConnection = newConnection(process.env.URI_MONGODB)

module.exports = {
    testConnection
}