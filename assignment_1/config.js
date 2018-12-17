/*
*
*ENVIRONMENT MODE CONFIGRATION 
*
*/

//ENVIRONMENTS
const env = {}

//DEVELOPEMENT MODE
env.dev = {
    'httpPort' : 8080,
    'envName'  : 'developement'
}

//PRODUCTION MODE
env.prod = {
    'httpPort' : 8081,
    'envName'  : 'production'
}

//EXPORTING CONFIG MODE
const currentMode = typeof(process.env.ENV_MODE) == 'string' ? process.env.ENV_MODE : '';
const currentEnv  = typeof(env[currentMode]) == 'object' ? env[currentMode] : env.dev;

module.exports = currentEnv;