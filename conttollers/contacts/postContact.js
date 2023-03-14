const Contacts = require('../../models/contacts')
const { contactSchema } = require('../../validator/validator')

const postContact = async (req, res, next) => {
   try {
    const { error } = contactSchema.validate(req.body)
    if (error) {
      res.status(400).json({ message: "missing required name field" })
    }
    const contact = await Contacts.create(req.body)
    res.status(201).json({ message: "contact created", code: 201, contact })
  }
  catch (error) {
    next(error)
  }
}


  module.exports = postContact