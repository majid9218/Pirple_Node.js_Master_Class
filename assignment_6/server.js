/*
*
*ASSIGNMENT #1
*SIMPLE HELLO WORLD RESTFUL API
*
*/

//DEPENDENCIES
const http          = require('http');
const url           = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config        = require('./config');

const server = {};

//CREATE HTTP SERVER
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

//UNIFIED SERVER
server.unifiedServer = (req, res) => {
    //PARSE URL
    const parsedURL = url.parse(req.url, true);
    //GETTING PATH
    const path = parsedURL.pathname;
    const trimedPath = path.replace(/^\/+|\/+$/g, '');
    //GETTING HEADERS
    const headers = req.headers;
    //GETTING QUERYSTRINGS
    const queryStringObjects = parsedURL.query;
    //GETTING METHOD        
    const method = req.method.toLocaleLowerCase();
    //GETTING PAYLOAD
    const decoder = new stringDecoder('UTF-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();
        //SETTING DATA
        const data = {
            'trimedPath'        : trimedPath,
            'headers'           : headers,
            'queryStringObjects': queryStringObjects,
            'method'            : method,
            'payload'           : buffer
        }
        //ROUTE HANDLING
        const chosenHandler = typeof(server.router[trimedPath]) !== 'undefined' ? server.router[trimedPath] : server.handlers.notFound;
        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload    = typeof(payload) == 'object' ? payload : {};
            const strPayload = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            //SENDING PAYLOAD & LOGGING DATA
            res.end(strPayload);
            console.log(data);
            console.log('status:'+statusCode+' - payload:'+strPayload);
        });
    });
}

//HANDLERS
server.handlers = {}
server.handlers.hello = (data, callback) => {
    callback(200, {'message': 'welcome to hello path!'});
}
server.handlers.notFound = (data, callback) => {
    callback(404);
}

//ROUTER
server.router = {
    'hello': server.handlers.hello
}

server.init = () => {
    //LISTEN TO HTTP PORT
    server.httpServer.listen(config.httpPort, () => {
        console.log(`SERVER STARTED AT PORT:${config.httpPort}`);
    });
};

module.exports = server;



