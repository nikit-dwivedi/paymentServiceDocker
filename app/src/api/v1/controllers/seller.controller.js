const { success, badRequest, unknownError } = require("../helpers/response_helper");
const { addSellerDetails, getAllSeller, sellerBySellerId, changeVerifyStatus } = require("../helpers/seller.helper")

exports.onboardSeller = async (req, res) => {
    try {
        const { userId } = req.body
        const { status, message, data } = await addSellerDetails(userId, req.body);
        return status ? success(res, message) : badRequest(res, message, data);
    } catch (error) {
        return unknownError(res, "unknown error");
    }
}
exports.getSellers = async (req, res) => {
    try {
        const { status, message, data } = await getAllSeller();
        return status ? success(res, message, data) : badRequest(res, message, data);
    } catch (error) {
        return unknownError(res, "unknown error")
    }
}
exports.getSellerInfo = async (req, res) => {
    try {
        const { sellerId } = req.body
        const { status, message, data } = await sellerBySellerId(sellerId);
        return status ? success(res, message, data) : badRequest(res, message, data);
    } catch (error) {
        console.log(error);
        return unknownError(res, "unknown error")
    }
}
exports.verifySeller = async (req, res) => {
    try {
        const { sellerId, verify } = req.body
        const { status, message, data } = await changeVerifyStatus(sellerId, verify);
        return status ? success(res, message) : badRequest(res, message, data)
    } catch (error) {
        return unknownError(res, "unknown error");
    }
}