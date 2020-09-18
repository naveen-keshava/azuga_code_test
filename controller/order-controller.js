#!/usr/bin/env node
"strict mode";
"esversion:6";

const baseController = require('./base-controller');
const orderAdapter = require('../bll/order-adapter');

/**
* @swagger
* /api/order:
*   post:
*     tags:
*       - Order
*     description: Get Order Invoice
*     parameters:
*       - name: body
*         description: parameters
*         in: body
*         schema:
*            $ref: '#/definitions/order'
*     responses:
*       200:
*         description: success
*         schema:
*           type: object
*           example: {"success": true,"resultCode": 0,"payload": {"ticket_symbol": "ABCDE","buying_price": 22.22,"deleted_at": null,"_id": "5f603cf9b6006e2f9b717abe","created_at": "2020-09-15T04:03:05.944Z","updated_at": "2020-09-15T04:03:05.944Z"}}
*/
module.exports.getOrderInvoice = async(req, resp)=>{
    try{
        let result = await orderAdapter.getOrderInvoice(req.body);
        baseController.sendSuccessResponse(result, resp);
    }
    catch(ex){ baseController.sendFailureResponse(ex, resp); }
}

/**
* @swagger
* definition:
*   order:
*     properties:
*       ticket_symbol:
*         type: string
*         example: ABCDE
*       buying_price:
*         type: number
*         example: 22.22
*/