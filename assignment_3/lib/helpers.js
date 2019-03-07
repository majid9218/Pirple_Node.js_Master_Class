/*
Application Helper Functions
*/

//Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');
//Helpers Obj
const helpers = {};
//Parse string to object function
helpers.parseStringToObject = (str) => {
    try{
        const strObj = JSON.parse(str);
        return strObj;
    }catch(e){
        return {};
    }
};
//Create hash function
helpers.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0){
        const hashed = crypto.createHmac('sha256', config.SECRET_KEY).update(str).digest('hex');
        return hashed;
    }else{
        return false;
    }
}
//Validate email function
helpers.validateEmail = (email) => {
    const regexStr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexStr.test(String(email).toLowerCase());
}
//Create token function
helpers.createToken = (num) => {
    num = typeof(num) == 'number' && num > 0 ? num : false;
    if(num){
        const charStr = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for(let i=0; i<num; i++){
            let randomNum = Math.floor(Math.random() * charStr.length);
            token += charStr.charAt(randomNum);
        }
        return token;
    }else{
        return false;
    }
};
//Send email by Mailgun
helpers.sendMailgun = (data, callback) => {
    //Check data keys
    const name = typeof(data.name) == 'string' && data.name.trim().length > 0 ? data.name.trim() : false;
    const email = typeof(data.email) == 'string' && data.email.trim().length > 0 ? data.email.trim() : false;
    const subject = typeof(data.subject) == 'string' && data.subject.trim().length > 0 ? data.subject.trim() : false;
    const text = typeof(data.text) == 'string' && data.text.trim().length > 0 ? data.text.trim() : false;
    if(name && email && subject && text){
        //Set mail data
        const mailData = {
            'from': `PirplePizzaDelivery <${config.mailgun.fromMail}>`,
            'to': `${name} <${email}>`,
            'subject': subject,
            'text': text
        }
        //Mail data to string
        const payloadString = querystring.stringify(mailData);
        //Request option
        const options = {
            'protocol': 'https:',
            'hostname': 'api.mailgun.net',
            'method': 'POST',
            'path': `/v3/${config.mailgun.domain}/messages`,
            'auth': `api:${config.mailgun.apiKey}`,
            'headers' : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(payloadString)
            }
        }
        //Send https request
        const req = https.request(options, (res) => {
            //Set and check status code 
            const statusCode = res.statusCode;
            if(statusCode == 200 || statusCode == 201){
                callback(false);
            }else{
                callback(`${statusCode}:${res.statusMessage}`);
            }
        });
        //Handle error
        req.on('error', (e) => {
            callback(e);
        });
        //Write payload
        req.write(payloadString);
        //End request
        req.end();
    }else{
        callback('Missing required parameter(s)!');
    }
}
//Make strip payment
helpers.makeStripePayment = (data, callback) => {
    //Get required data parameters
    const price = typeof(data.price) == 'number' && data.price > 0 ? data.price * 100: false;
    const email = typeof(data.email) == 'string' && helpers.validateEmail(data.email) ? data.email : false;
    const token = typeof(data.token) == 'string' && data.token.length > 0 ? data.token : 'tok_visa';
    if(price && email){
        //Set payment payload
        const payload = {
            "amount": price,
            "currency": 'usd',
            "description": `Stripe payment charged by ${email}`,
            "source": token,
        };
        //Set string payload
        const payloadString = querystring.stringify(payload);
        //Set https request options
        const options = {
            'protocol': 'https:',
            'hostname': 'api.stripe.com',
            'method': 'POST',
            'path': `/v1/charges`,
            'auth': config.stripe_SK,
            'headers' : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(payloadString)
            }
        }
        //Make https request
        const req = https.request(options, res => {
            if(res.statusCode == 200 || res.statusCode == 201){
                callback(false);
            }else{
                callback(`${res.statusCode}:${res.statusMessage}`);
            }
        });
        //Handle errors
        req.on('error', err => {
            callback(err);
        });
        //Write request payload
        req.write(payloadString);
        //End https request
        req.end();
    }else{
        callback('Missing required parameter(s)!');
    }
};
//Export Helpers
module.exports = helpers;