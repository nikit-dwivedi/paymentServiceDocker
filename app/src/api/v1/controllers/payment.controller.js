require('dotenv').config()
const { success, created, notFound, badRequest, serverError, unknownError, unauthorized, serverValidation } = require('../helpers/response.helpers')
const transactionModel = require("../models/transaction.model")
const { createOrderService, hash, getPaymentStatus, razorPayService, getRPPaymentStatus } = require('../helpers/payment.helper')
const { validateOrder } = require('../validations/order.validations')
const { validationResult } = require('express-validator')
const { createTransaction, getTransaction } = require('../helpers/transaction.helper')
const { parseJwt } = require('../middleware/authentication')

exports.createPayment = async function (req, res) {
    try {

        // const gotHash = req.headers.hash

        // const { status: hashStatus, message: hashMessage } = hash(gotHash)
        // if (!hashStatus) {
        //     return badRequest(res, hashMessage, '')
        // }
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return serverValidation(res, { errorName: "serverValidation", errors: result.array() })
        }
        const transactionData = await transactionModel.findOne({ order_id: req.body.orderId })
        if (transactionData) {
            return badRequest(res, "Order Id already used")
        }
        const customerDetails = {
            customer_id: req.body.userId,
            customer_name: req.body.name,
            customer_email: req.body.email,
            customer_phone: req.body.phone
        }
        const orderMeta = {
            notify_url: process.env.WEBHOOK_URL
        }
        const createData = {
            order_id: req.body.orderId,
            order_amount: req.body.amount,
            order_currency: 'INR',
            customer_details: customerDetails,
            order_meta: orderMeta
        }
        createOrderService(res, createData)
    } catch (error) {
        return badRequest(res, "Request is not valid", '')
    }
}

exports.createRPPayment = async (req, res) => {
    try {
        const { amount } = req.body
        const { status, message, data } = await razorPayService(amount)
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.addTransactions = async (req, res) => {
    try {
        const requestBody = req.body.data
        const transactionData = await transactionModel.findOne({ order_id: requestBody.order.order_id })

        transactionData.payment_status = requestBody.payment.payment_status
        transactionData.order_currency = requestBody.order.order_currency
        transactionData.cf_payment_id = requestBody.payment.cf_payment_id
        transactionData.payment_time = requestBody.payment.payment_time

        await transactionData.save()

        return transactionData ? success(res, "transaction details updated") : badRequest(res, 'Invalid details')
    } catch (error) {
        console.log(error);
        return badRequest(res, "unknow error", '')
    }
}

exports.checkPayment = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.userId) {
            return badRequest(res, "please onboard first")
        }
        const userId = token.userId
        const { orderId } = req.params
        const { type } = req.query
        if (type == 1) {
            await createTransaction(orderId)
            return success(res, "success")
        }
        const { status, message, data } = await getRPPaymentStatus(orderId)
        await createTransaction(orderId)
        return status ? success(res, message, data) : badRequest(res, message, data)
    } catch (error) {
        console.log(error);
        return badRequest(res, "unknown error", '')
    }
}
exports.getTransactionList = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.role===777) {
            return badRequest(res, "please onboard first")
        }
        const { from, to } = req.query
        
        const { status, message, data } = await getTransaction(from, to)
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        console.log(error);
        return badRequest(res, "unknown error", '')
    }
}




