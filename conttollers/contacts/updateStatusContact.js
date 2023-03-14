const { updateFavoriteSchema } = require('../../validator/validator')
const Contacts = require('../../models/contacts')


const updateStatusContact = async (req, res, next) => {
    try {
      const {error} = updateFavoriteSchema.validate(req.body)
        if (error) {
          res.status(400).json({"message": "missing field favorite"})
      }
      const {contactId} = req.params
      const contact = await Contacts.findByIdAndUpdate(contactId, req.body, {new: true})
        if (!contact) {
          res.status(404).json({"message": "Not found"})
      }
      res.status(200).json(contact)
    }
    catch (error) {
      next(error)
    }
  }

  module.exports = updateStatusContact