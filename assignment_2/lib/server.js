/* 
Delivery Pizza Restful API Server File,
Creating HTTP And HTTPS Servers.
*/

//Dependencies:
const http = require('http');
const https = require('https');
const handlers = require('./handlers');
const router = require('./routes')(handlers);
const path = require('path');
const config = require('./config');
const fs = require('fs');
const stringDecoder = require('string_decoder').StringDecoder;
const url = require('url');
const helpers = require('./helpers');


//Server Object
const appServer = {};

//Create HTTP Server
appServer.httpServer = http.createServer((req, res)  => {
    appServer.unifiedServer(req, res);
});

//Set HTTPS Options
appServer.httpsOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}
//Create HTTP Server
appServer.httpsServer = https.createServer(appServer.httpsOptions, (req, res)  => {
    appServer.unifiedServer(req, res);
});

//Unified HTTP/HTTPS Server Function
appServer.unifiedServer = (req, res) => {
    //Extract and trim pathname
    const pathUrl = url.parse(req.url, true);
    const path = pathUrl.pathname;
    const trimedPath = path.replace(/^\/+|\/+$/g, '');
    //Set Headers
    const headers = req.headers;
    //Set Method
    const method = req.method.toLowerCase();
    //Set Query String
    const queryStr = pathUrl.query;
    //Set Buffer
    const decoder = new stringDecoder('UTF-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    //End Request
    req.on('end', () => {
        //End buffer
        buffer += decoder.end();
        //Set Handler
        let chosenHandler = typeof(router[trimedPath]) !== 'undefined' ? router[trimedPath] : handlers.notFound;
        //Set Data
        const data = {
            'path': trimedPath,
            'headers': headers,
            'method': method,
            'queryString': queryStr,
            'payload': helpers.parseStringToObject(buffer)
        }
        //Handling
        chosenHandler(data, (statusCode, payload, contentType) => {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            contentType = typeof(contentType) == 'string' ? contentType : 'json';
            //Set String Payload
            let payloadStr = '';
            //Check Content-Type
            if(contentType == 'json'){
                res.setHeader('Content-Type', 'application/json');
                payload = typeof(payload) == 'object' ? payload : {};
                payloadStr = JSON.stringify(payload);
            }
            //Set and end response
            res.writeHead(statusCode);
            res.end(payloadStr);
            //Log Data
            if(statusCode == 200 || statusCode == 201){
                console.log('StatusCode: ' + statusCode);
            }
        });

    });
};

//Init App Server
appServer.init = () => {
    appServer.httpServer.listen(config.httpPort, () => {
        console.log('Listening to a port:', config.httpPort);
    });
    appServer.httpsServer.listen(config.httpsPort, () => {
        console.log('Listening to a port:', config.httpsPort);
    });
}

//Exporting Server
module.exports = appServer;