const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    licenceNumber: {
        type: String,
    },
    licenceType: {
        type: String,
    },
    licenceImage: {
        type: String
    },
    panNumber: {
        type: String,
    },
    addharNumber: {
        type: String
    },
    verificationStatus: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    isVerfied: {
        type: Boolean,
        default: false
    },
    numberOfShop: {
        type: Number,
        default: 0
    },
    outletList: {
        type: Array,
        default: []
    },
})

const sellerModel = mongoose.model('seller', sellerSchema);
module.exports = sellerModel;