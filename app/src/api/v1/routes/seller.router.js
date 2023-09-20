const express = require('express');
const router = express.Router();

const sellerController = require('../controllers/seller.controller');

router.get('/all', sellerController.getSellers);
router.post('/info', sellerController.getSellerInfo);
router.post('/', sellerController.onboardSeller);
router.post('/verify',sellerController.verifySeller)

module.exports = router;