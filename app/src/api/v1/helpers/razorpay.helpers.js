const Razorpay = require("razorpay");
// require("dotenv").config()

const key_id = process.env.RAZORPAY_CLIENT_ID_PROD
const key_secret = process.env.RAZORPAY_CLIENT_SECRET_PROD
const instance = new Razorpay({ key_id, key_secret });
exports.createOrder = async (amount) => {
    try {
        const options = {
            amount: amount * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "MarketPlace"
        };
        const data = await instance.orders.create(options);
        return { status: true, message: "order created", data }
    } catch (error) {
        return { status: false, message: error.error.description, data: {} }
    }
}

exports.getOrder = async (orderId) => {
    try {
        const data = await instance.orders.fetchPayments(orderId)
        const filterData = data.items.filter((payment) => payment.status == "captured")
        return filterData[0] ? { status: true, message: "payments details", data: filterData[0] } : { status: false, message: "payment not completed", data: {} }
    } catch (error) {
        return { status: false, message: error.error.description, data: {} }
    }
}
