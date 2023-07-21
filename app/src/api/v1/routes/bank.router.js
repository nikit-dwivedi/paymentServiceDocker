const express = require('express')
const router = express.Router()

const { addNewBank, getAllBank, getIndividualBank, getUserBank, updateBankDetails, deleteBankDetails } = require('../controllers/bank.controller')

const { authenticateUser, authenticateAdmin } = require('../middleware/authentication')

// Create a new bank account
router.post('/', authenticateUser, addNewBank);

// Get all bank accounts for a user
router.get('/', authenticateUser, getUserBank);

// Get a single bank account by account number
router.get('/individual/:bankId', authenticateUser, getIndividualBank);

// Update a bank account
router.post('/:bankId', authenticateUser, updateBankDetails);

// Get all bank
router.get('/all', authenticateAdmin, getAllBank);

// Delete a bank account
router.get('/remove/:bankId',authenticateUser,deleteBankDetails );

module.exports = router