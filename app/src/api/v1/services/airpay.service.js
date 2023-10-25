const airPayBaseUrl = 'https://kraken.airpay.co.in/airpay/ms/pos/api'
const merchantId = process.env.APMID

exports.createAPPayment = async () => {
    try {
        const url = `${airPayBaseUrl}/create`
    } catch (error) {

    }
}


function formatePaymentBody(paymentData) {
return{
    mercid:merchantId,
    orderid:paymentData.orderId,
    amount:paymentData.amount,
    currency:356,
    isocurrency:"INR",
    uniqueid
}
}