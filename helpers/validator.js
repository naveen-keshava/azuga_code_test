#!/usr/bin/env node
"strict mode";
"esversion:6";

const Joi = require('joi');
const baseController = require('../controller/base-controller');
const enumTypes = require('../enum-types');

Joi.objectId = require('joi-objectid')(Joi);

/* BEGIN Order Related Validation */
const orderSchema = Joi.object().keys({
   
});

module.exports.orderValidation = (req, resp, next)=> (validateObj(resp, req.body, orderSchema) == true) ?  next(): 0;
/* END Order Releted Validation */


// Validator
let validateObj = (resp, reqObj, schema)=>{
    try{
        let result = Joi.validate(reqObj, schema);
        if(result.error){
            baseController.sendFailureResponse(new Error(enumTypes.result.VALIDATION_ERROR), resp, result);
            return false;
        }
        else
            return true;
    }
    catch(ex){ baseController.sendFailureResponse(ex, resp) }
}