//Importing dependencies
const server = require('./server');
const os = require('os');
const cluster = require('cluster');

const init = () => {
    //Check if the thead is the master thread
    if(cluster.isMaster){
        //Initializing some stuff here ...
        //Example:
        console.log('Worker is running...');
        console.log('Cli is running...');
        //Check number of cpu cores and fork according to them
        for(let i=0; i<os.cpus().length; i++){
            cluster.fork();
        }
    }else{
        //Initializing app
        server.init();
    }
};

init();