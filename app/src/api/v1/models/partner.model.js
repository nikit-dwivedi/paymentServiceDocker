const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    partnerId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
    },
    dl: {
        type: String,
        required: true
    },
    rc: {
        type: String,
        required: true
    },
    vehicleNo: {
        type: String,
    }
})