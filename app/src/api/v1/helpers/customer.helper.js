const { customerFormatter } = require('../formatter/auth.format');
const customerModel = require('../models/customer.model');
const { markOnboarded } = require('./auth.helper');

module.exports = {
    onboardCustomer: async (userId, bodyData) => {
        try {
            const userCheck = await customerModel.exists({ userId: userId })
            if (userCheck) {
                return { status: false, message: "customer already onboarded" }
            }
            const formattedData = customerFormatter(userId, bodyData);
            const saveData = await customerModel(formattedData);
            await markOnboarded(userId);
            return await saveData.save() ? { status: true, message: "succesfully onboarded" } : { status: false, message: "please provide proper fields" };
        } catch (error) {
            console.log("=========helper", error);
            return { status: false, message: "please provide proper fields" }
        }
    },
    addNewAddress: async (userId, bodyData) => {
        try {
            const addAddress = await customerModel.findOneAndUpdate({ userId }, { $push: { addressList: addressData } })
            return addAddress ? { status: true, message: "address added successfully" } : { status: false, message: "address not added" };
        } catch (error) {
            return { status: false, message: "please provide proper fields" }
        }
    },
    removeAddress: async (userId, addressId) => {
        try {
            const retailData = await retailModel.updateOne(
                { userId: userId, "addressList._id": addressId },
                { $set: { "addressList.$.isActive": false } }
            );
            return retailData ? { status: true, message: "address removed successfully" } : { status: false, message: "address not removed" };
        } catch (error) {
            return { status: false, message: "please provide proper fields" }
        }
    }
}