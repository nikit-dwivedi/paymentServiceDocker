const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const clinetSchema = new Schema({
    clientId: {
        type: String,
        required: true
    },
    clientAddress: {
        type: String
    },
    clientLongitude: {
        type: Number,
    },
    clientLatitude: {
        type: Number
    }
})

const sellerSchema = new Schema({
    sellerId: {
        type: String,
        required: true
    },
    sellerAddress: {
        type: String
    },
    sellerLongitude: {
        type: Number,
    },
    sellerLatitude: {
        type: Number
    }
})
const patnerSchema = new Schema({
    patnerId: {
        type: String,
        required: true
    },
    patnerAddress: {
        type: String
    },
    patnerLongitude: {
        type: Number,
    },
    patnerLatitude: {
        type: Number
    }
})

const amountSchema = new Schema({
    totalAmount: {
        type: Number
    },
    deliveryCharge: {
        type: Number,
    },
    deliveryTip: {
        type: Number
    },
    taxAmount: {
        type: Number
    },
    discountedAmount: {
        type: Number,
    },
})

const productSchema = new Schema({
    productId: {
        type: String
    },
    productName: {
        type: String
    },
    quantity: {
        type: Number,
        default: 1
    },
    singlePrice: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    hasCustomization: {
        type: Boolean
    },
    customization: [{
        type: Object
    }]
})

const orderSchema = new Schema({
    orderId: {
        type: String,
        unique: true
    },
    product: [{
        type: productSchema,
    }],
    client: {
        type: clinetSchema
    },
    seller: {
        type: sellerSchema,
    },
    patner: {
        type: patnerSchema,
    },
    payableAmount: {
        type: Number,
    },
    amount: {
        type: amountSchema
    },

})
const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;