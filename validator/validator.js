const Joi = require('joi')

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
})

// const validator = schema => body => {
//   return schema.validate({ body }) 
// } 
// const contactValidator = validator(contactSchema)

module.exports = { contactSchema }
