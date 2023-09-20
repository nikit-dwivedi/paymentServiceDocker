const authModel = require('../models/auth.model');
const { sendSms, sendMail } = require('../services/otp.service');
const { authFormatter } = require('../formatter/auth.format');
const { randomBytes } = require('node:crypto');
const { checkEncryption } = require('../middlewares/authToken');

module.exports = {
    addAuth: async (bodyData) => {
        try {
            const formattedData = await authFormatter(bodyData);
            const saveData = await authModel(formattedData);
            if (bodyData.phone) {
                await sendSms(formattedData.phone, formattedData.otp)
                return await saveData.save() ? { reqId: formattedData.reqId, isOnboarded: false, isPhoneLogin: true } : false
            } else {
                await sendMail(formattedData.email, formattedData.otp)
                return await saveData.save() ? { reqId: formattedData.reqId, isEmailVerified: false, isOnboarded: false, isPhoneLogin: false } : false

            }
        } catch (error) {
            console.log("=========hepler", error);
            return false
        }
    },
    checkAuthByPhone: async (phone) => {
        try {
            const authData = await authModel.exists({ phone });
            return authData ? authData : false;
        } catch (error) {
            return false
        }
    },
    checkAuthByEmail: async (email) => {
        try {
            const authData = await authModel.exists({ email });
            return authData ? authData : false;
        } catch (error) {
            return false
        }
    },
    authList: async () => {
        try {
            const authData = await authModel.find();
            return authData[0] ? true : false;
        } catch (error) {
            return false
        }
    },
    genrateOtpEmail: async (email) => {
        const date = new Date
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const updatedData = await authModel.findOne({ email })
        if (updatedData.noOfOtp >= 3 && updatedData.date == date.getDate()) {
            return 1
        }
        updatedData.otp = otp;
        updatedData.reqId = reqId;
        updatedData.noOfOtp += 1
        updatedData.date = date.getDate()
        updatedData.isPhoneOtp = false;
        const saveData = await updatedData.save()
        if (!saveData) {
            return false
        }
        await sendMail(email, otp)
        return reqId
    },
    genrateOtpPhone: async (phone) => {
        const date = new Date
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const updatedData = await authModel.findOne({ phone })
        if (updatedData.noOfOtp >= 3 && updatedData.date == date.getDate()) {
            return 1
        }
        updatedData.otp = otp;
        updatedData.reqId = reqId;
        updatedData.noOfOtp += 1
        updatedData.date = date.getDate();
        updatedData.isPhoneOtp = true;
        const saveData = await updatedData.save()
        if (!saveData) {
            return false
        }
        await sendSms(phone, otp)
        return { reqId: reqId, isOnboarded: updatedData.isOnboarded }
    },
    verifyOtp: async (reqId, otp) => {
        try {
            const newReqId = randomBytes(4).toString('hex')
            const userData = await authModel.findOne({ reqId });
            if (!userData) {
                return false
            }
            if (userData.otp == otp) {
                if (!userData.isPhoneOtp) {
                    userData.isEmailVerified = true
                }
                const token = "token";
                userData.noOfOtp = 0
                userData.otp = 0
                userData.reqId = newReqId
                await userData.save()
                return token
            }
            return false
        } catch (error) {
            return false
        }
    },
    checkLogin: async (email, password) => {
        try {
            const userData = await authModel.findOne({ email });
            if (!userData) {
                return false;
            }
            const passwordCheck = await checkEncryption(password, userData.password);
            if (!passwordCheck) {
                return false;
            }
            if (userData.isEmailVerified) {
                userData.isLogin = true
                await userData.save()
                // const token = generateVerifiedyUserToken(userData);
                return { token: "token", isEmailVerified: true, isOnboarded: userData.isOnboarded };
            }
            const reqId = await genrateOtpEmail(userData.email)
            return { isEmailVerified: false, reqId: reqId, isOnboarded: userData.isOnboarded };
        }
        catch (error) {
            console.log(error);
            return false
        }
    },
    markOnboarded: async (userId) => {
        try {
            await authModel.findOneAndUpdate({ userId: userId }, { isOnboarded: true })
        } catch (error) {
            return false
        }
    }
}

const genrateOtpEmail = async (email) => {
    const date = new Date
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const reqId = randomBytes(4).toString('hex')
    const updatedData = await authModel.findOne({ email })
    if (updatedData.noOfOtp >= 3 && updatedData.date == date.getDate()) {
        return 1
    }
    updatedData.otp = otp;
    updatedData.reqId = reqId;
    updatedData.noOfOtp += 1
    updatedData.date = date.getDate()
    const saveData = await updatedData.save()
    if (!saveData) {
        return false
    }
    await sendMail(email, otp)
    return reqId
}