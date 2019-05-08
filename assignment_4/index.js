/*
Delivery Pizza Restful API Index JS File,
Initializing Server
*/

//Dependencies
const server = require('./lib/server');
const cli = require('./lib/cli');
//Application Object
const app = {};
//Init Function 
app.init = () => {
    //Initialize Server
    server.init();
    //Initialize CLI
    setTimeout(() => {
        cli.init();
    }, 50);
    
}
app.init();
//Export App Module If Needed
module.exports = app;
