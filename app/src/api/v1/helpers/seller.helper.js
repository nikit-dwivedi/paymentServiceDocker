const { sellerFormatter } = require('../formatter/auth.format');
const sellerModel = require('../models/seller.model');
const { markOnboarded } = require('./auth.helper');

exports.addSellerDetails = async (userId, bodyDate) => {
    try {
        const { status } = await this.sellerById(userId);
        if (status) {
            return { status: false, message: "seller allready onboared" }
        }
        const sellerFormat = sellerFormatter(userId, bodyDate);
        const saveData = await sellerModel(sellerFormat);
        await saveData.save()
        await markOnboarded(userId);
        return { status: true, message: "seller onboared successfully" }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}

exports.getAllSeller = async () => {
    try {
        const sellerData = await sellerModel.find().select('-_id -__v');
        if (!sellerData[0]) {
            return { status: true, message: "no Seller found", data: [] }
        }
        return { status: true, message: "Seller list", data: sellerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}

exports.sellerById = async (userId) => {
    try {
        const sellerData = await sellerModel.findOne({ userId });
        if (!sellerData) {
            return { status: false, message: "Seller not found", data: {} }
        }
        return { status: true, message: "Seller info", data: sellerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}

exports.sellerBySellerId = async (sellerId) => {
    try {
        const sellerData = await sellerModel.findOne({ sellerId });
        if (!sellerData) {
            return { status: false, message: "Seller not found", data: {} }
        }
        return { status: true, message: "Seller info", data: sellerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}

exports.changeVerifyStatus = async (sellerId, status) => {
    try {
        let sellerData
        if (status) {
            sellerData = await sellerModel.findOneAndUpdate({ sellerId }, { verificationStatus: "approved", isVerfied: true });
        } else {
            sellerData = await sellerModel.findOneAndUpdate({ sellerId }, { verificationStatus: "rejected" });
        }
        return sellerData ? { status: true, message: "status changed", data: {} } : { status: false, message: "status not changed", data: {} }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}