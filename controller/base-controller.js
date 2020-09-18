#!/usr/bin/env node
"strict mode";
"esversion:6";

const config = require("../web_config");
const enumTypes = require("../enum-types");

const SuccessResp = enumTypes.successResponse;
const FailureResp = enumTypes.failureResponse;

let sendSuccessResponse = (data, response) =>{
    response.status(enumTypes.httpStatusCodes.SUCCESS).send(SuccessResp((typeof data ==='undefined' && data === null) ? {} : data, enumTypes.result.SUCCESS))
};
let sendFailureResponse = (error, response, objectRef) => (isNaN(error.message)) ? _sendUnhandledError(error, response, objectRef) : _sendFailureResponse(error, response, objectRef);

let _sendFailureResponse = (error, response, objectRef) => {
    let logger = require("../helpers/utility").logger;

    logger.info('Controlled Error ::::: ErrorMessage : ' + error.message + ',::::: ErrorStack : '+ error)
    let result = parseInt(error.message);
    return response.status(enumTypes.resultForErrorCodes[result]).send(FailureResp(null, result, enumTypes.resultDef[result], objectRef));
};

let _sendUnhandledError = (error, response, objectRef) => {
    return new Promise((resolve, reject) => resolve())
        .then(() => {
            if (config.doPrintLogs)
                console.error("::::::::::::::::::: Base controller Error :::::::::::::::::::::: \n" + error.stack);

            response.status(enumTypes.httpStatusCodes.INTERNAL_SERVER_ERROR).send(FailureResp(error, enumTypes.result.INTERNAL_SERVER_ERROR, error.message, objectRef));
            _processShutDown(error);
        })
        .catch((err) => {
            if (config.doPrintLogs)
                console.error(err);
            _processShutDown(err);
        });
};

let _processShutDown = (error) => {
    let logger = require("../helpers/utility").logger;
    logger.error('Base Controller Error::::: ErrorMessage : ' + error.message + ',::::: ErrorStack : ' + error.stack);
};

module.exports.sendSuccessResponse = sendSuccessResponse;
module.exports.sendFailureResponse = sendFailureResponse;