const mongoose = require('mongoose');
const Schema = mongoose.Schema

const addressSchema = new Schema({
    name: {
        type: String
    },
    address: {
        type: String
    },
    longitude: {
        type: String
    },
    latitude: {
        type: String
    },
    isActive: {
        type: String
    },
})

const customerSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
    },
    addressList: [{
        type: addressSchema
    }],
}, { timestamps: true })

const customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;