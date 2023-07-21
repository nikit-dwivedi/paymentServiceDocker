const { createBankAccount, getBankAccountsByUserId, getBankAccountByBankId, getAllBankList, updateBankAccount, deleteBankAccount } = require("../helpers/bank.helper")
const { success, badRequest } = require("../helpers/response.helpers")
const { parseJwt } = require("../middleware/authentication")

exports.addNewBank = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        req.body.userId = token.role === 3 ? req.query.userId : token.userId
        const addBank = await createBankAccount(req.body)
        return success(res, "Bank Added")
    } catch (error) {
        return badRequest(res, error.message)
    }
}
exports.getUserBank = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const userId = token.role === 3 ? req.query.userId : token.userId
        const bankList = await getBankAccountsByUserId(userId)
        return success(res, "Bank List", bankList)
    } catch (error) {
        return badRequest(res, error.message)
    }
}
exports.getIndividualBank = async (req, res) => {
    try {
        const bankData = await getBankAccountByBankId(req.params.bankId)
        return success(res, "bank Details", bankData)
    } catch (error) {
        return badRequest(res, error.message)
    }
}
exports.getAllBank = async (req, res) => {
    try {
        console.log("++++++++++");
        const bankList = await getAllBankList()
        return success(res, "bank List", bankList)
    } catch (error) {
        return badRequest(res, error.message)
    }
}

exports.updateBankDetails = async (req, res) => {
    try {
        const bankDetail = await updateBankAccount(req.params.bankId, req.body)
        return success(res, "bank updated")
    } catch (error) {
        return badRequest(res, error.message)
    }
}

exports.deleteBankDetails = async (req, res) => {
    try {
        const bankDetail = await deleteBankAccount(req.params.bankId)
        return success(res, "bank removed")
    } catch (error) {
        return badRequest(res, error.message)
    }
}