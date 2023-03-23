const express = require('express')
const authentication = require('../../middleware/authMiddleware')
const ctrl = require('../../conttollers/index')

const router = express.Router()

router.get('/', authentication, ctrl.getContacts)

router.get('/:contactId', authentication, ctrl.getContactById)

router.post('/', authentication, ctrl.postContact)

router.delete('/:contactId', authentication, ctrl.deleteContact)

router.put('/:contactId', authentication, ctrl.updateContact)

router.patch('/:id/favorite', authentication, ctrl.updateStatusContact)

// router.get('/', ctrl.pagination)

module.exports = router
