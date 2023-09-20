const express = require('express');
const { login, verifyUserOtp } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);
router.post('/verify', verifyUserOtp);


module.exports = router