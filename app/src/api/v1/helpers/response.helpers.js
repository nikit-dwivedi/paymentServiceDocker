function success(res, message, items) {
    sendResponse(res, 200, true, message, '', items)
}

//send created response --------------------------------------------------------
async function created(res, message, items) {
    sendResponse(res, 201, true, message, '', items);
};

//send not found response ------------------------------------------------------
async function notFound(res, message) {
    sendResponse(res, 404, false, message, '', {});
};

//send bad request response ----------------------------------------------------
async function badRequest(res, message, error) {
    sendResponse(res, 400, false, message, error);
};

// send internal server error --------------------------------------------------
async function serverError(res, message, error){
    sendResponse(res, 500, false, message, error)
}

async function unauthorized(res, message, error){
    sendResponse(res, 401, false, message, error)
}
async function forbidden(res, message) {
    sendResponse(res, 403, false, message, '');
};


async function unknownError(res, message, error){
    sendResponse(res, 500, false, message, error)
}

async function serverValidation(res, error) {
    let responseErrors = {};
    const errors = error.errors;
    errors.forEach(error => {
        const [key, value] = [error.param.toUpperCase().replace('.', '-'), error.msg.toUpperCase().replace('.', '-')]
        responseErrors[key] = value.toUpperCase();
    });
    sendResponse(res, 400, false, 'Server Validation Errors', 'ValidationError', responseErrors);
    // res.status(400);
    // res.json({
    //     status: false,
    //     message: 'Server Validation Errors',
    //     error: 'ValidationError',
    //     items: responseErrors
    // });
}

function sendResponse(res, subCode, status, message, error, items) {
    let response = {
        status: status,
        subCode: subCode ,
        message: message,
        error: error,
        items: items
    }
    if (res.tokenInfo) {
        response.tokenInfo = res.tokenInfo
    }
    res.status(200);
    res.json(response);
}

module.exports = {
    success, 
    created, 
    notFound, 
    badRequest, 
    serverError, 
    unknownError,
    unauthorized, 
    forbidden,
    serverValidation
}