const Contacts = require('../../models/contacts')

const getContactById = async (req, res, next) => {
try{
  const { contactId } = req.params
  const contact = await Contacts.findById(contactId)
  if (!contact) {
    res.status(404).json({ message: "Contact is not found" })
   
  } 
     res.status(200).json(contact)
}
  catch (error) {
    next(error)
  }
}

module.exports = getContactById