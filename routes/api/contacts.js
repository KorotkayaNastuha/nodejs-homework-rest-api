const express = require('express')

const ctrl = require('../../conttollers/index')

const router = express.Router()

router.get('/', ctrl.getContacts)

router.get('/:contactId', ctrl.getContactById)

router.post('/', ctrl.postContact)

router.delete('/:contactId', ctrl.deleteContact)

router.put('/:contactId', ctrl.updateContact)

router.patch('/:id/favorite', ctrl.updateStatusContact)

module.exports = router
