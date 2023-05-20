const Joi = require('joi')

// Create function validate field in user schema
const userValidate = data => {
    const userSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required()
    })

    return userSchema.validate(data)
}

module.exports = {
    userValidate
}