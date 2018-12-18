/*
Delivery Pizza Restful API Index JS File,
Initializing Server
*/

//Dependencies
const server = require('./lib/server');
//Application Object
const app = {};
//Init Function 
app.init = () => {
    server.init();
}
app.init();
//Export App Module If Needed
module.exports = app;
