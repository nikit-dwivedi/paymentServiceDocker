const { body, header } = require('express-validator')

exports.orderCheck = () => {
    return [
        header('hash', 'invalid hash').not().isEmpty().isHash('sha256').trim(),
        body('amount', 'invalid amount').not().isEmpty().isCurrency().trim(),
        body('userId', 'invalid userId').not().isEmpty().isAlphanumeric().trim(),
        body('orderId', 'invalid order Id').not().isEmpty().isAlphanumeric().trim(),
        body('name', 'invalid name').not().isEmpty().isAlpha('en-US', { ignore: ' ' }).trim(),
        body('email', 'invalid email').optional().isEmail().trim(),
        body('phone', 'invalid phone').not().isEmpty().isMobilePhone('en-IN').isLength({ min: 10, max: 10 }).trim()
    ]
}