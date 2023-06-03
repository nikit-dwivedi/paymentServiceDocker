require('dotenv').config()
const { success, created, notFound, badRequest, serverError, unknownError } = require('../helpers/response.helpers')

exports.validateOrder = (req) => {
    try {
        let message = ""
        let charCheck = false

        const { amount, userId, orderId, name, email, phone, ...garbage } = req.body
        const garbageEnteries = Object.entries(garbage)
        if (!amount || !userId || !orderId || !name || !email || !phone || garbageEnteries[0]) {
            message = "Please provide valid input"
            return {
                isValid: false,
                message: message,
                status: process.env.BAD_REQUEST
            }
        }


        const charaterCheck = ["-", "~", "!", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "=", "+", "{", "}", "[", "]", "/", "*", "'", '"', ";", ":", ",", ".", "|", "\\", "?", ">", "<", "`"]
        for (const char of name) {
            if (charaterCheck.includes(char)) {
                charCheck = true
            }
        }
        if (charCheck) {
            message = "Please provide valid name"
            return {
                isValid: false,
                message: message,
                status: process.env.BAD_REQUEST
            }
        }

        const isAmountNumeric = isNumeric(amount)

        if (!isAmountNumeric) {
            message = "Please provide valid amount"
            return {
                isValid: false,
                message: message,
                status: process.env.BAD_REQUEST
            }
        }

        const isEmailValid = isEmail(email)

        if (!isEmailValid) {
            message = "Please provide valid email"
            return {
                isValid: false, 
                message: message,
                status: process.env.BAD_REQUEST
            }
        }

        const isPhoneNumeric = isNumeric(phone)

        console.log(typeof phone);
        // console.log(phone.toString[1] === 0);
        if (!isPhoneNumeric || phone.length != 10 || phone[0] === "0") {
            message = "Please provide valid phone number"
            return {
                isValid: false,
                message: message,
                status: process.env.BAD_REQUEST
            }
        }

        return {
            isValid: true,
        }

    } catch (error) {
        console.log(error);
        message = "Unknown error"
        return {
            isValid: false,
            message: message,
            status: process.env.UNKNOWN
        }
    }

}

function isNumeric(strValue) {
    return /^[0-9]+$/.test(strValue);
}


function isEmail(strValue) {
    // const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    const regexExp = /\S+@\S+\.\S+/

    return regexExp.test(strValue);
}