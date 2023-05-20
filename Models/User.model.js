const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {testConnection} = require('../helpers/connections_multi_mongodb')
const bcrypt = require('bcrypt')
const createError = require('http-errors')

// Create a new User schema
const UserSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    collection: "users"
})

// Handle encrypt password before save to db
UserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password, salt)
        this.password = hashPassword
        next()
    } catch (error) {
        next(error)
    }
})

// Create method check password for user
UserSchema.methods.isCorrectPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw createError.InternalServerError(error.message)
    }
}

module.exports = {
    User: testConnection.model('User', UserSchema)
}