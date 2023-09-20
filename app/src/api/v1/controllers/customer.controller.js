const { onboardCustomer, addNewAddress } = require("../helpers/customer.helper")
const { unknownError, success, badRequest } = require("../helpers/response_helper")

module.exports = {
    onboard: async (req, res) => {
        try {
            const saveData = await onboardCustomer(req.body.userId, req.body);
            return saveData.status ? success(res, saveData.message) : badRequest(res, saveData.message);
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    },
    addAddress: async (req, res) => {
        try {
            const saveData = await addNewAddress(userID, req.body);
            return saveData.status ? success(res, saveData.message) : badRequest(res, saveData.message);
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    }
}