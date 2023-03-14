const Contacts = require('../../models/contacts')
const { contactSchema } = require('../../validator/validator')

const updateContact = async (req, res, next) => {
    const { error } = contactSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })
  const { name, email, phone } = req.body
  const { contactId } = req.params
  if (!name && !email && !phone) {
    res.status(400).json({message: "missing fields"})
  }
  const contact = await Contacts.findByIdAndUpdate(contactId, req.body)
  if (contact) {
    res.status(200).json(contact)
  } else {
    res.status(404).json({message: "Not found"})
  }
}

  module.exports = updateContact