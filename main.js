#!/bin/env node
"esversion:6";
"strict mode";

// Load Required Packages
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require("express");
const cluster = require('cluster');
const bodyParser = require("body-parser");
const enumTypes = require('./enum-types');
const ENV_TYPE = require("./web_config").ENV_TYPE;
const config = require("./web_config");

process.env.NODE_ENV = ENV_TYPE;

// Swagger definition
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
    info: { // API informations (required)
        swagger: '2.0',
        title: 'service Running on ' + ENV_TYPE + ' Environment', // Title (required)
        version: config.serverReleaseVersion, // Version (required)
        description: 'API Documentation List', // Description (optional)
    },
    //  Path to the API docs 
    host:config.base_url,
    basePath:"/",
    schemes: ["http", "https"],
    securityDefinitions: {
        JWT: {
            type: 'apiKey',
            description: 'JWT authorization for the API',
            name: 'x-access-token',
            in: 'header',
        },
    },
    produces: "application/json"
};
const swaggerSpec = swaggerJSDoc({ swaggerDefinition: swaggerDefinition, apis: ['./controller/*.js'] });

// Server starts here
let expressServer = () =>{
    // Create express application  
    let app = module.exports = express(); 
    // Static content
    app.use('/public', express.static('public'));

    // Associate Body-Parser to parse the data in JSON format.
    app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
    app.use(bodyParser.json({ limit: '20mb' }));

    // Swagger Documentation
    if (config.enableApiDoc) {
        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // Serve swagger docs the way you like (Recommendation: swagger-tools)
        app.get('/api-docs.json', (req, res)=> {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
    }

    app.rejectUnauthorized = true;

    //Set headers for all incoming requests
    app.all('/*', (request, response, next)=> {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', '*');
        response.header('Access-Control-Expose-Headers', '*');
        response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH');
        response.header('Access-Control-Allow-Credentials', 'true');
        response.header('Access-Control-Max-Age', '1209600');
        next();
    });

    let server = app.listen(config.port, async (err) => {
        if (err) console.error(err);

        if (config.doPrintLogs)
            console.log('Saheli services are started!!! Running on port %d', config.port);

        // Initalize routes
        app.use('/', require('./routes'));
        if (config.doPrintLogs)
            console.log('Routes are OK');
    });
    server.timeout = 120000;

    //Universel error handler
    app.use((err, req, res, next) => {
        if (config.doPrintLogs)
            console.error("::::::::::::::::::::::::::::::: Seviour Error ::::::::::::::::::::::::::::: \n" + err.stack);

        logger.error('Seviour Error::::: ErrorMessage : ' + err.message + ',::::: ErrorStack : ' + err.stack + ',::::: ErrorNumber : ' + err.errno);
        res.status(enumTypes.httpStatusCodes.INTERNAL_SERVER_ERROR);
        res.end(enumTypes.failureResponse(err, enumTypes.result.INTERNAL_SERVER_ERROR, err.message));
    });
};

// Running server as cluser or stand alone
if(config.enableCluster){
    if (cluster.isMaster) {
        // Count the machine's CPUs
        var CPUcount = require('os').cpus().length;
        for (var i = 0; i < CPUcount; i++)  // Create a worker for each CPU
            cluster.fork();
    }
    else 
        expressServer();
    //Listen for dying workers
    cluster.on('exit',(worker)=> {
        if (config.enableApiDoc) {
            console.warn("Worker with ID " + worker.id + " died :(");
            console.warn("\n:::::::::::: Server Restarting ::::::::::::\n");
        }
        // Replace the dead worker, 
        cluster.fork();
    });
}
else
    expressServer();