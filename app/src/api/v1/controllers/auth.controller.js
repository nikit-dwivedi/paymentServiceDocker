const { genrateOtpPhone, addAuth, verifyOtp, checkAuthByPhone, checkAuthByEmail, genrateOtpEmail, checkLogin } = require("../helpers/auth.helper")
const { unknownError, success, badRequest } = require("../helpers/response_helper");
const authModel = require("../models/auth.model");

module.exports = {
    login: async (req, res) => {
        try {
            const { phone, email, password } = req.body
            if (req.body.phone) {
                const userCheck = await checkAuthByPhone(phone);
                if (userCheck) {
                    let otpResponse = await genrateOtpPhone(phone);
                    if (otpResponse == 1) {
                        return badRequest(res, "otp limit reached")
                    }
                    otpResponse.isPhoneLogin = true
                    return otpResponse ? success(res, 'otp send succesfully', otpResponse) : badRequest(res, "failed to send otp")
                }
                const addUser = await addAuth(req.body);
                return addUser ? success(res, "otp sent successfully", addUser) : badRequest(res, "otp not send")
            }
            const userCheck = await checkAuthByEmail(email);
            if (userCheck) {
                const userCheck = await checkLogin(email, password)
                userCheck.isPhoneLogin = false;
                return userCheck ? success(res, 'login succesfully', userCheck) : badRequest(res, "invalid credentials")
            }
            const addUser = await addAuth(req.body);
            return addUser ? success(res, "otp sent successfull", addUser) : badRequest(res, "bad request")
        } catch (error) {
            console.log(error);
            return unknownError(res, "unknown error")
        }
    },
    verifyUserOtp: async (req, res) => {
        try {
            const { reqId, otp } = req.body
            const otpCheck = await verifyOtp(reqId, otp);
            return otpCheck ? success(res, "otp verified", otpCheck) : badRequest(res, "otp not verified");
        } catch (error) {
            return false
        }
    },
}