const express = require('express');
const { onboard } = require('../controllers/customer.controller');
const router = express.Router();


router.post('/onboard', onboard);

module.exports = router;