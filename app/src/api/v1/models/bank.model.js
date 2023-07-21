const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bankSchema = new Schema({
    bankId: {
        type: String,
        required: true,
        unique: true

    },
    userId: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    accountHolder: {
        type: String,
        required: true,
    },
    ifsc: {
        type: String,
        required: true,
    },
    branchName: {
        type: String,
    },
    beneficiaryName: {
        type: String
    },
    bankName: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const bankModel = mongoose.model('bank', bankSchema)
module.exports = bankModel