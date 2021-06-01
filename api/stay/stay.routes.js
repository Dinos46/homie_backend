const express = require('express')
const {getStays, getStay, deleteStay, updateStay, addStay} = require('./stay.controller')
const router = express.Router()
    
router.get('/', getStays)
router.get('/:id', getStay)
router.put('/:id',  updateStay)
router.post('/:id', addStay)
router.delete('/:id',  deleteStay)

module.exports = router