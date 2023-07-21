const { formatBank, formatEditBank } = require('../formatter/bank.formatter.js');
const bankModel = require('../models/bank.model.js'); // Make sure to include the correct path to your bankModel file

exports.createBankAccount = async function (data) {
    try {
        const formattedData = formatBank(data)
        const newBankAccount = await bankModel.create(formattedData);
        return newBankAccount;
    } catch (error) {
        throw new Error('Error creating bank account: ' + error.message);
    }
}

exports.getBankAccountsByUserId = async function (userId) {
    try {
        const bankAccounts = await bankModel.find({ userId, isActive: true }).select("-_id bankId accountNumber accountHolder ifsc branchName beneficiaryName bankName");
        return bankAccounts;
    } catch (error) {
        throw new Error('Error getting bank accounts: ' + error.message);
    }
}

exports.getBankAccountByBankId = async function (bankId) {
    try {
        const bankAccount = await bankModel.findOne({ bankId, isActive: true }).select("-_id bankId accountNumber accountHolder ifsc branchName beneficiaryName bankName");
        return bankAccount;
    } catch (error) {
        throw new Error('Error getting bank account: ' + error.message);
    }
}

exports.updateBankAccount = async function (bankId, updateData) {
    try {
        const formattedData = formatEditBank(updateData)
        const updatedBankAccount = await bankModel.findOneAndUpdate(
            { bankId },
            formattedData,
            { new: true } // Return the updated document
        );
        return updatedBankAccount;
    } catch (error) {
        throw new Error('Error updating bank account: ' + error.message);
    }
}

exports.deleteBankAccount = async function (bankId) {
    try {
        await bankModel.findOneAndUpdate({ bankId }, { isActive: false });
    } catch (error) {
        throw new Error('Error deleting bank account: ' + error.message);
    }
}

exports.getAllBankList = async function () {
    try {
        const bankList = await bankModel.find().select("-_id bankId accountNumber accountHolder ifsc");
        return bankList;
    } catch (error) {
        throw new Error('Error adding multiple bank accounts: ' + error.message);
    }
}
