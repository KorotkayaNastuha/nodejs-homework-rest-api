const Contacts = require('../../models/contacts')

const getContacts = async (req, res, next) => {
  try {
  const contact = await Contacts.find({})
  // console.log('GET /', contact)
  res.status(200).json(contact)
  }
  catch (error) {
    next(error)
  }
}


module.exports = getContacts