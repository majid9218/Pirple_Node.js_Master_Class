/* GENERAL LIBRARY CONTAINS FUNCTIONS WITH DIFFERENT PURPOSES FOR TESTING */

//dependencies
const URL     = require('url');
const http    = require('http');
const https   = require('https');

//create lib object
const lib = {};

//generate random number 
lib.generateRandomNumber = (min, max) => {
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
};

//generate random string with specified length, 10 as default.
lib.generateRandomString = (length) => {
    length = typeof(length) == 'number' && length > 0 ? length : 10;
    const charStr = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for(let i=0; i<length; i++){
        let randomNum = Math.floor(Math.random() * charStr.length);
        str += charStr.charAt(randomNum);
    }
    return str;
};

//parse json to object
lib.parseStringToObject = (str) => {
    try{
        const parsed = JSON.parse(str);
        return parsed;
    }catch(e){
        return {};
    }
};

//check palindrom string
lib.checkPalindrom = (str) => {
    str = typeof(str) == 'string' ? str.toLowerCase().split(' ').join('') : '';
    return str == str.split('').reverse().join('');
};

//function make http/https request to a website and retun statusCode and status Message
lib.checkWebsiteStatus = (protocol, url, method, callback) => {
    //check vars
    protocol = typeof(protocol) == 'string' && protocol == 'http' ? protocol : 'https';
    const parsedURL  = URL.parse(protocol+'://'+url, true);
    const hostname = parsedURL.hostname;
    const path     = parsedURL.path;
    //set request data
    const requestDetails = {
        'protocol': protocol + ':',
        'hostname': hostname,
        'method'  : method.toUpperCase(),
        'path'    : path,
    }
    //set protocol
    const protocolToUse = protocol == 'http' ? http : https;
    //sen request
    const req = protocolToUse.request(requestDetails, (res) => {
        callback(false, res.statusCode);
    });
    //handle error
    req.on('error', function(e){
        callback('Missed required param!');
    });
    //end request
    req.end();
}

//export lib
module.exports = lib;
