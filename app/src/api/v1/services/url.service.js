const orderBaseStage = 'http://139.59.60.119:4007'
const orderBaseProd = 'https://order.fablocdn.com'

module.exports = {
    orderEndPoint: (orderId) => {
        return `${orderBaseProd}/v1/order/mp/details/${orderId}`
    }
}