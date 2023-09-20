const { randomBytes } = require('node:crypto');
const { encryption } = require('../middlewares/authToken');

module.exports = {
    authFormatter: async (data) => {
        const d = new Date
        let encryptedPassword
        const userId = randomBytes(4).toString('hex')
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        let isPhoneOtp = true
        if (data.password) {
            encryptedPassword = await encryption(data.password)
            isPhoneOtp = false;
        }
        return {
            userId: userId,
            email: data.email,
            userType: data.userType,
            password: encryptedPassword,
            phone: data.phone,
            otp: otp,
            reqId: reqId,
            userType: data.userType,
            date: d.getDate(),
            isPhoneOtp: isPhoneOtp
        }
    },
    customerFormatter: (userId, data) => {
        const customerId = randomBytes(4).toString('hex')
        return {
            userId: userId,
            customerId: customerId,
            name: data.name,
            addressList: [{
                address: data.address,
                longitude: data.longitude,
                latitude: data.latitude,
                isDefault: true
            }]
        }
    },
    sellerFormatter: (userId, data) => {
        const sellerId = randomBytes(4).toString('hex')
        return {
            userId: userId,
            sellerId: sellerId,
            name: data.name,
            licenceNumber: data.licenceNumber,
            licenceImage: data.licenceImage,
            licenceType: data.licenceType,
            panNumber: data.panNumber,
            addharNumber: data.addharNumber,
        }
    }
}