const express = require('express')
const { validationResult, body } = require('express-validator')
const router = express.Router()

const { createPayment, addTransactions, checkPayment, createRPPayment, getTransactionList, getTransactionListOfOutlet, paymentSuccess, paymentFail } = require('../controllers/payment.controller')
const { orderCheck } = require('../validations/payment.validator')

const { authenticateUser, authenticateAdmin, authenticateSeller } = require('../middleware/authentication')

router.post('/createPayment', authenticateUser,createRPPayment)
router.get('/transaction', authenticateAdmin,getTransactionList)
router.get('/check/:orderId', authenticateUser,checkPayment);
router.post('/transaction/outlet', authenticateSeller,getTransactionListOfOutlet);
router.post("/aitPay/success",paymentSuccess)
router.post("/aitPay/fail",paymentFail)


// router.post('/test', checking(), (req, res) => {
//     const result = validationResult(req)
//     console.log(result);
//     if(!result.isEmpty()){
//         console.log("Provide valid input");
//         res.send(result.errors[0].msg)
//     }else{
//         res.send("done")
//     }

// })

module.exports = router