const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentSchema = new Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true

    },
    mpOrderId: {
        type: String,
        required: true
    },
    refundId: {
        type: String,
    },
    totalAmountReceived: {
        type: Number
    },
    client: {
        customId: {
            type: String
        },
        deduction: {
            type: Number,
            default: 0
        },
        paymentAmount: {
            type: Number
        }
    },
    outlet: {
        customId: {
            type: String
        },
        deduction: {
            type: Number,
            default: 0
        },
        paymentAmount: {
            type: Number
        }
    },
    partner: {
        customId: {
            type: String
        },
        deduction: {
            type: Number,
            default: 0
        },
        paymentAmount: {
            type: Number
        }
    },
    tax: {
        type: Number,
    },
    platformsPayment: {
        type: Number
    },
    paymentMode: {
        type: String
    },
    paymentStatus: {
        type: String
    }
}, { timestamps: true })

const paymentModel = mongoose.model('payment', paymentSchema)
module.exports = paymentModel