#!/usr/bin/env node
"strict mode";
"esversion:6";

const app = require('express').Router();

const orderController = require("./controller/order-controller");

// Order releted routes
app.post("/api/order",  orderController.getOrderInvoice);

module.exports = app;