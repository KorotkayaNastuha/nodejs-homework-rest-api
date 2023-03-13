const Contacts = require('../../models/contacts')


const deleteContact = async (req, res, next) => {
   try{
    const { contactId } = req.params
    const contact = await Contacts.findByIdAndDelete(contactId)
    if (!contact) {
      const error = new Error(`contact by id=${contactId} not found`);
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: `contact deleted`, code: 200, contact })
    }catch (error) {
  next(error)
    }
}

  module.exports = deleteContact