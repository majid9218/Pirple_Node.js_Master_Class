/*
Pizza Delivery API Configrations
*/

//Enviroment Object
const env = {};
//Development Mode
env.development = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envMode': 'developement',
    'SECRET_KEY': '8137gfyibl134',
    'hostName': 'localhost:3000',
    'maxCardsNumber': 7,
    'menuItemIds': ['menuItem1', 'menuItem2', 'menuItem3', 'menuItem4', 'menuItem5', 'menuItem6', 'menuItem7'],
    'globalVars': {
        'appName' : 'Pizza Delivery',
        'companyName' : 'Majid, Inc.',
        'yearCreated' : '2018'
    },
    'stripe_SK': 'sk_test_This_Is_Secret',
    'mailgun': {
         'apiKey': '00000000000000000000000000000000-00000000-00000000',
         'domain': 'sandbox000000000000000000000000000000.mailgun.org',
         'fromMail': 'postmaster@sandbox000000000000000000000000000000.mailgun.org'
    }
}
//Production Mode
env.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envMode': 'production',
    'SECRET_KEY': '8137gfyibl134',
    'hostName': 'www.pirple-pizza-delivery.com',
    'maxCardsNumber': 7,
    'menuItemIds': ['menuItem1', 'menuItem2', 'menuItem3', 'menuItem4', 'menuItem5', 'menuItem6', 'menuItem7'],
    'globalVars': {
        'appName' : 'Pizza Delivery',
        'companyName' : 'Majid, Inc.',
        'yearCreated' : '2018'
    },
    'stripeApi_key': 'sk_test_This_Is_Secret',
    'mailgun': {
        'apiKey': '00000000000000000000000000000000-00000000-00000000',
        'domain': 'sandbox000000000000000000000000000000.mailgun.org',
        'fromMail': 'postmaster@sandbox000000000000000000000000000000.mailgun.org'
   }
}
//Mode To Export
const currentMode = typeof(process.env.ENV_MODE) == 'string' ? process.env.ENV_MODE : '';
const modeToExport = typeof(env[currentMode]) == 'object' ? env[currentMode] : env.development;
//Export Config
module.exports = modeToExport;