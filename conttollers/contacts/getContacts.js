const Contacts = require('../../models/contacts')

const getContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user
    const { page = 1, limit = 10} = req.query
    
    const skip = (page - 1) * limit
    const contact = await Contacts.find({ owner },"name email phone", { skip, limit: Number(limit) }).populate("owner", "email")
  res.status(200).json(contact)
  }
  catch (error) {
   next(error)
  }
}


module.exports = getContacts