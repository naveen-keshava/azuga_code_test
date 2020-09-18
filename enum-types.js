#!/usr/bin/env node
"strict mode";
"esversion:6";

module.exports.httpStatusCodes = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    DATA_NOT_AVALIBLE: 404,
    
    INTERNAL_SERVER_ERROR: 500
};

module.exports.result = {
    SUCCESS: 0, // Success for all response if successful
   
    // validation error
    VALIDATION_ERROR: 150,
    /*** 500 Server Error ***/
    SERVER_ERROR: 500
};

module.exports.resultDef = {
    // Validation Error
    '150': "Validation Error",

    // HTTP Error Codes
    '401': 'unathorized',
    '500': 'Internal Server Error',
    '501': 'Language Not Supported',
    '502': 'Last Corn Already Ran'
}

module.exports.resultForErrorCodes = {
    '150': this.httpStatusCodes.BAD_REQUEST,

    // HTTP Error Codes
    '401': this.httpStatusCodes.UNAUTHORIZED,
    '500': this.httpStatusCodes.INTERNAL_SERVER_ERROR,
    '501': this.httpStatusCodes.BAD_REQUEST,
    '502': this.httpStatusCodes.BAD_REQUEST
};

module.exports.categoriesTax ={
    MEDICINES: 5,// {name: "Med", tax_val: 5}
    FOOD: 5,
    CLOTHES_MIN: 5, // {name: "Clothes", range: [{isLeassthen: true, value: 1000, tax: 5}, {isLeassthen: false, value: 1000, tax: 12}]}
    CLOTHES_MAX: 12,
    CD_DVD: 3,
    IMPORTED: 18,
    DEFAULT: 0
}

module.exports.successResponse = (data, code) => {
    return {
        success: true,
        resultCode: code,
        payload: data
    }
};

module.exports.failureResponse = (errorObj, code, errorMessage, objectRef) => {
    let result = {
        success: false,
        resultCode: code,
        error: {
            message: errorMessage
        }
    };

    if (errorObj)
        result.error.errorObj = errorObj.stack;
    if (typeof objectRef != 'undefined' && objectRef != null)
        result.error.objectRef = objectRef;

    return result;
};