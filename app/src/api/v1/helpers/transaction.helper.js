const { orderEndPoint } = require("../services/url.service")
const { get } = require("../services/axios.service")
const { randomBytes } = require('node:crypto');
const paymentModel = require("../models/transaction.model")


exports.createTransaction = async (order_id) => {
    try {
        const orderUrl = orderEndPoint(order_id)
        const orderData = await get(orderUrl)
        if (!orderData) {
            return { status: false, message: "Order Not found" }
        }
        const calculatePlatformCharge = orderData.items.payableAmount - ((orderData.items.amount.totalAmount - orderData.items.amount.discountedAmount) + orderData.items.amount.deliveryCharge + orderData.items.amount.taxAmount)
        const transactionData = {
            transactionId: randomBytes(4).toString('hex'),
            mpOrderId: order_id,
            refundId: "",
            totalAmountReceived: orderData.items.payableAmount,
            client: {
                customId: orderData.items.client.clientId,
                deduction: orderData.items.payableAmount,
                paymentAmount: 0
            },
            outlet: {
                customId: orderData.items.outlet.outletId,
                totalAmount: orderData.items.amount.totalAmount,
                paymentAmount: orderData.items.amount.totalAmount - orderData.items.amount.discountedAmount,
                discountAmount: orderData.items.amount.discountedAmount
            },
            partner: {
                customId: "",
                paymentAmount: orderData.items.amount.deliveryCharge
            },
            paymentMode: orderData.items.payment.paymentMode,
            tax: orderData.items.amount.taxAmount,
            platformsPayment: calculatePlatformCharge,
            paymentStatus: orderData.items.payment.paymentStatus,
        }
        const saveData = await paymentModel(transactionData)
        const result = await saveData.save()
        return result ? { status: true, message: "transaction created" } : { status: false, message: "transaction not created" }
    } catch (error) {
        return { status: false, message: error.message }
    }
}


exports.getTransaction = async (from, to) => {
    try {
        let query = sellerId ? { status: "delivered", } : { status: "delivered" }
        if (from && to) {
            query.createdAt = {
                $gte: new Date(from),
                $lt: new Date(to)
            }
        } else {
            let d = new Date
            let a = d.getDate()
            let b = d.getMonth()
            let c = d.getFullYear()
            query.createdAt = {
                $gte: new Date(c, b, a),
                $lt: new Date(c, b, a + 1)
            }
        }
        const transactionList = await paymentModel.find(query).lean().select("-_id client outlet partner totalAmountReceived platformsPayment paymentMode")
        return transactionList[0] ? { status: true, message: "transaction List", data: transactionList } : { status: false, message: "transaction not found" }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

exports.getTransactionFromOutlet = async (from, to, outletList) => {
    try {
        let query = { 'outlet.customId': { $in: outletList } }
        if (from && to) {
            query.createdAt = {
                $gte: new Date(from),
                $lt: new Date(to)
            }
        }
        else {
            let d = new Date
            let a = d.getDate()
            let b = d.getMonth()
            let c = d.getFullYear()
            query.createdAt = {
                $gte: new Date(c, b, a),
                $lt: new Date(c, b, a + 1)
            }
        }
        const transactionList = await paymentModel.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: "$outlet.customId",
                    outletId: { $first: "$outlet.customId" },
                    orderCount: {
                        $sum: 1
                    },
                    totalSettlement: {
                        $sum: "$outlet.paymentAmount"
                    },
                    transactions: {
                        $push: {
                            totalAmountReceived: "$$ROOT.totalAmountReceived",
                            paymentAmount: "$$ROOT.outlet.paymentAmount",
                            discountAmount: "$$ROOT.outlet.discountAmount",
                            totalAmount: "$$ROOT.outlet.totalAmount",
                            transactionId: "$$ROOT.transactionId",
                            mpOrderId: "$$ROOT.mpOrderId",
                            status: "$$ROOT.status",
                            deduction: "$$ROOT.outlet.deduction",
                            tax: "$$ROOT.tax",
                            orderDate: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$$ROOT.createdAt"
                                }
                            },
                            settlementDate: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: { $add: ["$$ROOT.createdAt", 3 * 24 * 60 * 60 * 1000] }
                                }
                            }
                        }
                    },
                }
            },
            {
                $project: {
                    _id: 0,
                    outletId: 1,
                    orderCount: 1,
                    transactions: 1,
                    totalSettlement: 1
                }
            }
        ])
        return transactionList[0] ? { status: true, message: "transaction List", data: transactionList } : { status: false, message: "transaction not found" }
    } catch (error) {
        return { status: false, message: error.message }
    }
}