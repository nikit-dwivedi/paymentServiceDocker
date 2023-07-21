const { randomBytes } = require("node:crypto")

exports.formatBank = function (bankData) {
    const bankId = randomBytes(4).toString("hex")
    const { userId, accountNumber, accountHolder, ifsc, branchName, beneficiaryName, bankName } = bankData
    return { bankId, userId, accountNumber, accountHolder, ifsc, branchName, beneficiaryName, bankName }
}

exports.formatEditBank = function (bankData) {
    const { accountNumber, accountHolder, ifsc, branchName, beneficiaryName, bankName } = bankData
    return { accountNumber, accountHolder, ifsc, branchName, beneficiaryName, bankName }
}