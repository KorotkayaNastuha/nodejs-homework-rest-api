const express = require('express')
const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../models/contacts')
const { contactSchema } = require('../../validator/validator')

const router = express.Router()
const contacts = require('../../models/contacts')

router.get('/', async (req, res, next) => {
  const contacts = await listContacts()
  console.log('GET /', contacts)
  res.status(200).json(contacts)
})

router.get('/:contactId', async (req, res, next) => {
  try{
  const { contactId } = req.params
  const contact = await getContactById(contactId)
  if (!contact) {
    res.status(404).json({ message: "Contact is not found" })
   
  } 
     res.status(200).json(contact)
}
  catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body)
    if (error) {
      res.status(400).json({ message: "missing required name field" })
    }
    const contact = await addContact(req.body)
    res.status(201).json({ message: "contact created", code: 201, contact })
  }
  catch (error) {
    next(error)
  }
}
)

router.delete('/:contactId', async (req, res, next) => {
  try{
    const { contactId } = req.params
    const  contact = await contacts.removeContact(contactId)
    if (!contact) {
      const error = new Error(`contact by id=${contactId} not found`);
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: `contact deleted`, code: 200, contact })
    }catch (error) {
  next(error)
    }
})
router.put('/:contactId', async (req, res, next) => {
  const { error } = contactSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })
  const { name, email, phone } = req.body
  const { contactId } = req.params
  if (!name && !email && !phone) {
    res.status(400).json({message: "missing fields"})
  }
  const contact = await updateContact(contactId, req.body)
  if (contact) {
    res.status(200).json(contact)
  } else {
    res.status(404).json({message: "Not found"})
  }
})

module.exports = router
