/* Client Side Handlers */

//Dependencies
const fs = require('fs');
const path = require('path');
const config = require('./config');

//Set client handlers object
const client = {};

//Index page handler
client.index = (data, callback) => {
    if(data.method == 'get'){
        //Set tempalte data
        const templateData = {
            'head.title' : 'Main Page',
            'head.description': 'This is the main page',
            'body.class': 'index'
        } 
        //Get page template
        client.getTemplate('index', templateData, (err, str) => {
            if(!err && str){
                //Get whole template
                client.getWholeTemplate(str, templateData, (err, finalStr) => {
                    if(!err && finalStr){
                        callback(200, finalStr, 'html');
                    }
                    else{
                        callback(500, undefined, 'html');
                    }
                });
            }else{
                callback(500, undefined, 'html');
            }
        });
    }else{
        callback(405, undefined, 'html');
    }
};

//Account create page handler
client.accountCreate = (data, callback) => {
    if(data.method == 'get'){
        //Set tempalte data
        const templateData = {
            'head.title' : 'Create Account',
            'head.description': 'Create an account',
            'body.class': 'accountCreate'
        } 
        //Get page template
        client.getTemplate('accountCreate', templateData, (err, str) => {
            if(!err && str){
                //Get whole template
                client.getWholeTemplate(str, templateData, (err, finalStr) => {
                    if(!err && finalStr){
                        callback(200, finalStr, 'html');
                    }
                    else{
                        callback(500, undefined, 'html');
                    }
                });
            }else{
                callback(500, undefined, 'html');
            }
        });
    }else{
        callback(405, undefined, 'html');
    }
};

//Account settings page handler
client.accountEdit = (data, callback) => {
    if(data.method == 'get'){
        //Set tempalte data
        const templateData = {
            'head.title' : 'Account Settings',
            'head.description': 'Edit your account',
            'body.class': 'accountEdit'
        } 
        //Get page template
        client.getTemplate('accountEdit', templateData, (err, str) => {
            if(!err && str){
                //Get whole template
                client.getWholeTemplate(str, templateData, (err, finalStr) => {
                    if(!err && finalStr){
                        callback(200, finalStr, 'html');
                    }
                    else{
                        callback(500, undefined, 'html');
                    }
                });
            }else{
                callback(500, undefined, 'html');
            }
        });
    }else{
        callback(405, undefined, 'html');
    }
};

//Account deleted page handler
client.accountDelete = (data, callback) => {
    if(data.method == 'get'){
        //Set tempalte data
        const templateData = {
            'head.title' : 'Account Deleted',
            'head.description': 'Yor Account Has Been Deleted',
            'body.class': 'accountDelete'
        } 
        //Get page template
        client.getTemplate('accountDelete', templateData, (err, str) => {
            if(!err && str){
                //Get whole template
                client.getWholeTemplate(str, templateData, (err, finalStr) => {
                    if(!err && finalStr){
                        callback(200, finalStr, 'html');
                    }
                    else{
                        callback(500, undefined, 'html');
                    }
                });
            }else{
                callback(500, undefined, 'html');
            }
        });
    }else{
        callback(405, undefined, 'html');
    }
};

//Place order page handler
client.orders = (data, callback) => {
    if(data.method == 'get'){
        //Set tempalte data
        const templateData = {
            'head.title' : 'Place Order',
            'head.description': 'Order your pizza now!',
            'body.class': 'placeOrder'
        } 
        //Get page template
        client.getTemplate('placeOrder', templateData, (err, str) => {
            if(!err && str){
                //Get whole template
                client.getWholeTemplate(str, templateData, (err, finalStr) => {
                    if(!err && finalStr){
                        callback(200, finalStr, 'html');
                    }
                    else{
                        callback(500, undefined, 'html');
                    }
                });
            }else{
                callback(500, undefined, 'html');
            }
        });
    }else{
        callback(405, undefined, 'html');
    }
};

//Success order handler
client.succeeded = (data, callback) => {
    if(data.method == 'get'){
        //Set tempalte data
        const templateData = {
            'head.title' : 'Success',
            'head.description': 'Yor order has been recieved successfully!',
            'body.class': 'orderSuccess'
        } 
        //Get page template
        client.getTemplate('orderSuccess', templateData, (err, str) => {
            if(!err && str){
                //Get whole template
                client.getWholeTemplate(str, templateData, (err, finalStr) => {
                    if(!err && finalStr){
                        callback(200, finalStr, 'html');
                    }
                    else{
                        callback(500, undefined, 'html');
                    }
                });
            }else{
                callback(500, undefined, 'html');
            }
        });
    }else{
        callback(405, undefined, 'html');
    }
};

//Menu items page handler
client.items = (data, callback) => {
    if(data.method == 'get'){
        //Set tempalte data
        const templateData = {
            'head.title' : 'Menu',
            'head.description': 'Here is our pizza list menu',
            'body.class': 'menuItems'
        } 
        //Get page template
        client.getTemplate('menuItems', templateData, (err, str) => {
            if(!err && str){
                //Get whole template
                client.getWholeTemplate(str, templateData, (err, finalStr) => {
                    if(!err && finalStr){
                        callback(200, finalStr, 'html');
                    }
                    else{
                        callback(500, undefined, 'html');
                    }
                });
            }else{
                callback(500, undefined, 'html');
            }
        });
    }else{
        callback(405, undefined, 'html');
    }
};

//Session create page handler
client.sessionCreate = (data, callback) => {
    if(data.method == 'get'){
        //Set tempalte data
        const templateData = {
            'head.title' : 'Signin',
            'head.description': 'Loggong in',
            'body.class': 'sessionCreate'
        } 
        //Get page template
        client.getTemplate('sessionCreate', templateData, (err, str) => {
            if(!err && str){
                //Get whole template
                client.getWholeTemplate(str, templateData, (err, finalStr) => {
                    if(!err && finalStr){
                        callback(200, finalStr, 'html');
                    }
                    else{
                        callback(500, undefined, 'html');
                    }
                });
            }else{
                callback(500, undefined, 'html');
            }
        });
    }else{
        callback(405, undefined, 'html');
    }
};

//Favicon handler
client.favicon = (data, callback) => {
    //Check method
    if(data.method == 'get'){
        //Read static asset
        client.readStaticAsset('favicon.ico', (err, data) => {
            if(!err && data){
                callback(200, data, 'favicon');
            }else{
                callback(500, undefined, 'favicon');
            }
        });
    }else{
        callback(405);
    }
};

//Public handler
client.public = (data, callback) => {
    //Check method
    if(data.method == 'get'){
        //Set filename
        const filename = data.path.replace('public/', '').trim();
        if(filename.length > 0){
            //Read static asset
            client.readStaticAsset(filename, (err, data) => {
                if(!err && data){
                    //Set content type
                    let contentType = 'plain';
                    //If filename is css
                    if(filename.indexOf('.css') > -1){
                        contentType = 'css';
                    }
                    //if filename is png
                    if(filename.indexOf('.png') > -1){
                        contentType = 'png';
                    }
                    //if filename is jpg
                    if(filename.indexOf('.jpg') > -1){
                        contentType = 'jpg';
                    }
                    //if filename is favicon
                    if(filename.indexOf('.ico') > -1){
                        contentType = 'favicon';
                    }
                    //Callback 200
                    callback(200, data, contentType);
                }else{
                    callback(404);
                }
            });
        }else{
            callback(404);
        }
    }else{
        callback(405);
    }
};

//Get full template with header, footer and page content
client.getWholeTemplate = (str, data, callback) => {
    //Check paremeters
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== 'null' ? data : false;
    //Get header tempalate
    client.getTemplate('_header', data, (err, headetStr) => {
        if(!err && headetStr){
            //Get footer template
            client.getTemplate('_footer', data, (err, footerStr) => {
                if(!err && footerStr){
                    const undefinedTemplate = headetStr + str + footerStr;
                    callback(false, undefinedTemplate);
                }else{
                    callback('Not found Footer!');
                }
            });
        }else{
            callback('Not found header!');
        }
    });
}

//Get template function
client.getTemplate = (templateName, data, callback) => {
    //Set template name
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
    //Check template name
    if(templateName){
        //Set base directory
        const basDir = path.join(__dirname, '/../templates/');
        //Read template file
        fs.readFile(`${basDir}${templateName}.html`, 'utf8', (err, str) => {
            if(!err && str && str.length > 0){
                const fullString = client.interpolate(str, data);
                callback(false, fullString);
            }else{
                callback('Template not exist!');
            }
        });
    }else{
        callback('Missing paremeter - template name!');
    }
};

//Interpolate String function
client.interpolate = (str, data) => {
    //Check paremeters
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};
    //Set global variables in data object
    for(let keyname in config.globalVars){
        if(config.globalVars.hasOwnProperty(keyname)){
            data['global.'+keyname] = config.globalVars[keyname];
        }
    }
    //Replace variables in the string
    for(let key in data){
        if(data.hasOwnProperty(key) && typeof(key) == 'string'){
            let find = '{' + key + '}';
            let replace = data[key];
            str = str.replace(find, replace);
        }
    }
    return str;
};

//Read static assets function
client.readStaticAsset = (filename, callback) => {
    //Check filename
    filename = typeof(filename) == 'string' && filename.length > 0 ? filename : false;
    if(filename){
        //Set base url
        const baseUrl = path.join(__dirname, '/../public/');
        //Read file
        fs.readFile(baseUrl+filename, (err, data) => {
            if(!err && data){
                callback(false, data);
            }else{
                callback('No such a file!');
            }
        });
    }else{
        callback('Missing paremeter(s)!');
    }
};


//Export client
module.exports = client;