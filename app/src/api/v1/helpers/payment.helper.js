require('dotenv').config()
const axios = require('axios')
const transactionModel = require("../models/transaction.model")
const { success, created, notFound, badRequest, serverError } = require('./response.helpers')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { createOrder, getOrder } = require('../services/razorpay.service')
const salt = 10;

exports.createOrderService = (res, createData) => {

    const url = `${process.env.CASHFREE_BASE_URL}/orders`

    const config = {
        headers: {
            'x-api-version': '2022-09-01',
            'x-client-id': process.env.CASHFREE_CLIENT_ID,
            'x-client-secret': process.env.CASHFREE_CLIENT_SECRET
        }
    }

    axios.post(url, createData, config)
        .then(async (response) => {
            const data = {
                cf_order_id: response.data.cf_order_id,
                order_id: response.data.order_id,
                order_amount: response.data.order_amount,
            }

            await transactionModel(data).save()

            const order_data = {
                cf_order_id: response.data.cf_order_id,
                cf_token: response.data.payment_session_id
            }

            created(res, "Payment order created", order_data)
        }).catch((error) => {
            badRequest(res, error.message, '')
        })

}

exports.razorPayService = async (amount) => {
    try {
        const { status, message, data } = await createOrder(amount)
        return { status, message, data }
    } catch (error) {
        return { status: false, message: error, data: {} }
    }
}

exports.hash = (gotHash) => {
    try {
        const salting = bcrypt.hash(process.env.CASHFREE_CLIENT_SECRET, salt)
        const hash = crypto.createHash('sha256')
        const finalHash = hash.update(process.env.CASHFREE_CLIENT_SECRET, 'utf-8', salting).digest('hex')

        if (finalHash === gotHash) {
            return { status: true, message: "success" }
        } else {
            return { status: false, message: "invalid hash" }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

exports.getPaymentStatus = async (orderId) => {
    try {
        const url = `${process.env.CASHFREE_BASE_URL}/orders/${orderId}/payments`
        const config = {
            headers: {
                'x-api-version': '2022-01-01',
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET
            }
        }
        const response = await axios.get(url, config)
        if (!response.status) {
            return { status: false, message: response.message }
        }
        const data = {
            orderId,
            paymentMode: response.data[0].payment_group,
            orderAmount: response.data[0].order_amount,
            paymentStatus: response.data[0].payment_status,
            time: response.data[0].payment_completion_time,
            method: response.data[0].payment_method
        }
        return { status: true, message: "success", data: data }
    } catch (error) {
        console.log(error);
        return { status: false, message: error.message }
    }
}

exports.getRPPaymentStatus = async (orderId) => {
    try {
        const { status, message, data } =await getOrder(orderId)
        return { status, message, data }
    } catch (error) {
        console.log(error);
        return { status: false, message: error.message }
    }
}