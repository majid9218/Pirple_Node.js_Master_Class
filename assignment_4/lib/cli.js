/* Pizza Delivery CLI Application */

//dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
const e = new _events();
const _data = require('./data');

//set cli object
const cli = {};

//event handlers
e.on('man', () => {
    cli.responders.help();
});

e.on('help', () => {
    cli.responders.help();
});

e.on('exit', () => {
    cli.responders.exit();
});

e.on('list menu', () => {
    cli.responders.listMenu();
});

e.on('list recent orders', () => {
    cli.responders.listRescentOrders();
});

e.on('more order info', (str) => {
    cli.responders.moreOrderInfo(str);
});

e.on('list recent users', () => {
    cli.responders.listRecentUsers();
});

e.on('more user info', (str) => {
    cli.responders.moreUserInfo(str);
});

//responders
cli.responders = {};

//man/help
cli.responders.help = () => {
    //the commands object with their descriptions
    const commands = {
        'exit' : 'Kill the CLI (and the rest of the application)',
        'man' : 'Show this help page',
        'help' : 'Alias of the "man" command',
        'List menu' : 'Show a list of menu items',
        'List recent orders' : 'Show a list of orders that delivered in the last 24 hours',
        'More order info --{orderId}' : 'Show details of a specified order',
        'List recent users' : 'Show a list of users that registered in the last 24 hours',
        'More user info --{email}' : 'Show details of a specified user'
    };
    //set horizontal lines and centered title
    cli.setVerticalSpace();
    cli.setHorizontalLine();
    cli.setCenteredTitle('CLI MANUAL');
    cli.setHorizontalLine();
    cli.setVerticalSpace(2);
    //set manual details
    for(let key in commands){
        if(commands.hasOwnProperty(key)){
            let description = commands[key];
            let line = '\x1b[32m'+ ' ' + key +'\x1b[0m';
            let padding = 60 - key.length;
            for(let i=0; i<padding; i++){
                line+=' ';
            }
            line+=description;
            console.log(line);
            cli.setVerticalSpace();
        }
    }
    //set vertical space and horizontal line
    cli.setVerticalSpace();
    cli.setHorizontalLine();
    cli.setVerticalSpace();
};

//exit
cli.responders.exit = () => {
    process.exit(0);
};

//list menu
cli.responders.listMenu = () => {
    //get menu items from menu dir
    _data.list('menu', (err, menuItemIds) => {
        if(!err && menuItemIds && menuItemIds.length > 0){
            //read item data and print item object
            menuItemIds.forEach(itemId => {
                _data.read('menu', itemId, (err, itemData) => {
                    if(!err && itemData){
                        console.dir(itemData, {colors: true});
                        cli.setVerticalSpace();
                    }
                });
            });
            //set vertical space
            cli.setVerticalSpace(2);
        }
    });
};

//list recent orders
cli.responders.listRescentOrders = () => {
    //get orders from orders dir
    _data.list('orders', (err, ordersIds) => {
        if(!err && ordersIds && ordersIds.length > 0){
            //read order data by order id
            ordersIds.forEach(orderId => {
                _data.read('orders', orderId, (err, orderData) => {
                    if(!err && orderData){
                        //print order created in the last 24 hours
                        let lastDay = Date.now() - 1000*60*60*24;
                        if(orderData.date > lastDay){
                            //print order line
                            let line = 'ID: '+orderData.id+'  USER: '+orderData.email+'  PRICE: '+orderData.price+'$'+'  success: '+orderData.success
                            console.log(line);
                            cli.setVerticalSpace();
                        }
                    }
                });
            });
            //set vertical space
            cli.setVerticalSpace();
        }
    });
};

//more order info
cli.responders.moreOrderInfo = (str) => {
    //extract the id from the string
    const arr = str.split('--');
    const orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(orderId){
        //read order data and print order object
        _data.read('orders', orderId, (err, orderData) => {
            if(!err && orderData){
                cli.setVerticalSpace(2);
                console.dir(orderData, {colors: true});
                cli.setVerticalSpace(2);
            }
        });
    }
};

//list recent users
cli.responders.listRecentUsers = () => {
    //get users from users dir
    _data.list('users', (err, usersIds) => {
        if(!err && usersIds && usersIds.length > 0){
            //read yser data by user id
            usersIds.forEach(userId => {
                _data.read('users', userId, (err, userData) => {
                    if(!err && userData){
                        //print user created in the last 24 hours
                        let lastDay = Date.now() - 1000*60*60*24;
                        if(userData.timeCreated > lastDay){
                            //print user line
                            let line = 'EMAIL: '+userData.email+'  FULLNAME: '+userData.firstName+' '+userData.lastName+'  ACTIVE: '+userData.active;
                            console.log(line);
                            cli.setVerticalSpace();
                        }
                    }
                });
            });
            //set vertical space
            cli.setVerticalSpace();
        }
    });
};

//more user info
cli.responders.moreUserInfo = (str) => {
    //extract the email from the string
    const arr = str.split('--');
    const userEmail = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(userEmail){
        //read user data and print user object
        _data.read('users', userEmail+'@', (err, userData) => {
            if(!err && userData){
                cli.setVerticalSpace(2);
                console.dir(userData, {colors: true});
                cli.setVerticalSpace(2);
            }
        });
    }
};

//set vertival space function
cli.setVerticalSpace = num => {
    num = typeof(num) == 'number' && num > 0 ? num : 1;
    for(let i=0; i<num; i++){
        console.log('');
    }
};

//set horizontal line function
cli.setHorizontalLine = () => {
    //set screen width
    const width = process.stdout.columns;
    //set the line
    let line = '';
    for(let i=0; i<width; i++){
        line+='-';
    }
    console.log(line);
};

//set centered title function
cli.setCenteredTitle = title => {
    title = typeof(title) == 'string' && title.length > 0 ? title : 'NO TITLE';
    //set screen width and left padding
    const width = process.stdout.columns;
    const leftPadding = Math.floor((width - title.length) / 2);
    //set and print line
    let line = '';
    for(let i=0; i<leftPadding; i++){
        line+=' ';
    }
    line+=title;
    console.log(line);
};

//process string function
cli.processStr = str => {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
    if(str){
        //set available commands
        const availableCommands = [
            'man',
            'help',
            'exit',
            'list menu',
            'list recent orders',
            'more order info',
            'list recent users', 
            'more user info'
        ];
        //check if string entered by user is available
        let commandIsCalled = false;
        availableCommands.some(command => {
            if(str.indexOf(command) > -1){
                //set comandIsCalled as a true and emit command
                commandIsCalled = true;
                e.emit(command, str);
                return true;
            }
        });
        //if command entered not available
        if(!commandIsCalled){
            console.log('Sorry, try again!');
        }
    }
};

//set init function
cli.init = () => {
    //console log cli is running
    console.log('\x1b[36m%s\x1b[0m','The CLI is running');
    //create interface
    const interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    });
    //prompt created interface
    interface.prompt();
    //reading lines created by user
    interface.on('line', (str) => {
        //string to lower case and process the string
        const lowerdString = str.toLowerCase();
        cli.processStr(lowerdString);
        //Prompt interface again
        interface.prompt();
    });
    //handling interface close
    interface.on('close', () => {
        process.exit(0);
    });
};

//exporting cli obj
module.exports = cli;