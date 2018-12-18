/*
Pizza Delivery Application API Handlers.
*/

//Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
//Handlers Obj
const handlers = {}

/* API Handlers */

//Ping Route Handler
handlers.ping = (data, callback) => {
    callback(200);
};


//Not Found Handler
handlers.notFound = (data, callback) => {
    callback(404);
};


//Users Handler
handlers.users = (data, callback) => {
    //Verify if method accepted
    const acceptedMethods = ['post', 'get', 'put', 'delete'];
    if(acceptedMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    }else{
        callback(405, {'Error': 'Not acceptable method'});
    }
};
//_Users Obj
handlers._users = {};
//Users post method
handlers._users.post = (data, callback) => {
    //Verify required fields 
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    const address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    if(firstName && lastName && email && address && password && tosAgreement){
        //Check if email is valid
        if(helpers.validateEmail(email)){
            //Read data to check if the given email not exists
            _data.read('users', email+'@', (err) => {
                if(err){
                    //Hash the password
                    const hashedPassword = helpers.hash(password);
                    if(hashedPassword){
                        //Set data object
                        const userData = {
                            'firstName': firstName,
                            'lastName': lastName,
                            'email': email,
                            'address': address,
                            'password': hashedPassword,
                            'tosAgreement': true,
                            'active': false
                        }
                        //Create a new user
                        _data.create('users', email+'@', userData, (err) => {
                            if(!err){
                                //Create a hash related to user email
                                const hashedMail = helpers.hash(email);
                                const emailHash = {
                                    'email': email,
                                    'hash': hashedMail
                                }
                                _data.create('hashes', hashedMail, emailHash, err => {
                                    if(!err){
                                        //Send activation email
                                        const protocol = process.env.ENV_MODE == 'production' ? 'https' : 'http';
                                        const text = `Hello Mr/Ms.${lastName}. Welcome to Piple Pizza Delivery. You can activate your account by clicking on the url: ${protocol}://${config.hostName}/api/activate?hash=${hashedMail}`;
                                        const emailData = {
                                            'name': lastName,
                                            'email': email,
                                            'subject': 'Activate Account',
                                            'text': text
                                        }
                                        helpers.sendMailgun(emailData, err => {
                                            if(!err){
                                                callback(200);
                                            }else{
                                                callback(500);
                                            }
                                        });
                                    }else{
                                        callback(500, {'Error': 'Error in hashing!'});
                                    }
                                });
                            }else{
                                //Could not create a new user
                                callback(500, {'Error': 'Could not create a user!'});
                            }
                        });
                    }else{
                        callback(500, {'Error': 'Error in hashing password!'});
                    }
                }else{
                    callback(400, {'Error': 'Email address already exists!'});
                }
            });
        }else{
            callback(400, {'Error': 'Not valid email address!'});
        }
    }else{
        callback(400, {'Error': 'Missing required field(s)!'});
    }
};
//Users get method
handlers._users.get = (data, callback) => {
    //Check email in query string 
    const email = typeof(data.queryString.email) == 'string' && data.queryString.email.trim().length > 0 ? data.queryString.email.trim() : false;
    if(email){
        //Check email validity
        if(helpers.validateEmail(email)){
            //Authenticate user
            const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            handlers.verifyToken(tokenId, email, authorized => {
                if(authorized){
                    //Read user data
                    _data.read('users', email+'@', (err, userData) => {
                        if(!err && userData){
                            //Delete password from user data.
                            delete userData.password;
                            callback(200, userData);
                        }else{
                            callback(404);
                        }
                    });
                }else{
                    callback(403, {'Error': 'Not Authorized!'});
                }
            });
        }else{
            callback(400, {'Error': 'User email is not valid!'});
        }
    }else{
        callback(400, {'Error': 'Missing required field(s)!'});
    }
};
//User put method
handlers._users.put = (data, callback) => {
    //Set requeried and optional fields
    const email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    //Check required field
    if(email && helpers.validateEmail(email)){
        if(firstName || lastName || address || password){
            //Authenticate User
            const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
            handlers.verifyToken(tokenId, email, isVerified => {
                if(isVerified){
                    //Get user by email
                    _data.read('users', email+'@', (err, userData) => {
                        if(!err && userData){
                            //Change firstname if given
                            if(firstName){
                                userData.firstName = firstName;
                            }
                            //Change lastname if given
                            if(lastName){
                                userData.lastName = lastName;
                            }
                            //Change address if given
                            if(address){
                                userData.address = address;
                            }
                            //Change password if given
                            if(password){
                                userData.password = helpers.hash(password);
                            }
                            //Update user data
                            _data.update('users', email+'@', userData, err => {
                                if(!err){
                                    callback(200);
                                }else{
                                    callback(500, {'Error': 'Could not update user data!'})
                                }
                            });
                        }else{
                            callback(400, {'Error': 'User with the given email may not exists!'});
                        }
                    });
                }else{
                    callback(403, {'Error': 'Not Authorized!'});
                }
            });
        }else{
            callback(400, {'Error': 'Missing field to update!'})
        }
    }else{
        callback(400, {'Error': 'A valid user email is required!'});
    }

};
//User delete method
handlers._users.delete = (data, callback) => {
    //Check required email in query string
    const email = typeof(data.queryString.email) == 'string' && data.queryString.email.trim().length > 0 ? data.queryString.email.trim() : false;
    if(email && helpers.validateEmail(email)){
        //Authenticate User
        const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers.verifyToken(tokenId, email, isVerified => {
            if(isVerified){
                //Delete user
                _data.delete('users', email+'@', err => {
                    if(!err){
                        callback(200);
                    }else{
                        callback(500, {'Error': 'Could not delete user!'})
                    }
                });
            }else{
                callback(403, {'Error': 'Not Authorized!'});
            }
        });
    }else{
        callback(400, {'Error': 'A valid user email is required!'});
    }
};

//Token handler
handlers.tokens = (data, callback) => {
    //Verify if method accepted
    const acceptedMethods = ['post', 'get', 'put', 'delete'];
    if(acceptedMethods.indexOf(data.method) > -1){
        handlers._tokens[data.method](data, callback);
    }else{
        callback(405, {'Error': 'Not acceptable method'});
    }
};
//_tokens obj
handlers._tokens = {};
//Token post method
handlers._tokens.post = (data, callback) => {
    //Verify required field(s).
    const email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if(email && password){
        //Read user by email if exists
        _data.read('users', email+'@', (err, user) => {
            if(!err && user){
                //Check if password is correct
                const hashedPassword = helpers.hash(password);
                if(hashedPassword == user.password){
                    //Create token id
                    const tokenId = helpers.createToken(40);
                    //Set token object
                    const tokenData = {
                        'id': tokenId,
                        'email': email,
                        'expires': Date.now() + 1000 * 60 * 60 //Token expires every one hour
                    }
                    //Create token
                    _data.create('tokens', tokenId, tokenData, (err) => {
                        if(!err){
                            callback(200, tokenData);
                        }else{
                            callback(500, {'Error': 'Could not create a token!'});
                        }
                    });
                }else{
                    callback(400, {'Error': 'Incorrect password!'})
                }
            }else{
                callback(400, {'Error': 'User with given email may not exists!'})
            }
        });
    }else{
        callback(400, {'Error': 'Missing required field(s)!'})
    }
};
//Token get function
handlers._tokens.get = (data, callback) => {
    //Check required fields
    const tokenId = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 40 ? data.queryString.id.trim() : false;
    if(tokenId){
        //Get token By id
        _data.read('tokens', tokenId, (err, tokenData) => {
            if(!err && tokenData){
                callback(200, tokenData);
            }else{
                callback(404);
            }
        });
    }else{
        callback(400, {'Error': 'Missing required field(s)!'});
    }
};
//Token put function
handlers._tokens.put = (data, callback) => {
    //Check requried field(s).
    const tokenId = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 40 ? data.payload.id.trim() : false;
    const extended = typeof(data.payload.extended) == 'boolean' && data.payload.extended == true ? true : false;
    if(tokenId && extended){
        //Get token by id
        _data.read('tokens', tokenId, (err, tokenData) => {
            if(!err && tokenData){
                //Check if token is expired
                if(tokenData.expires > Date.now()){
                    //set new expires
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    //Update token
                    _data.update('tokens', tokenId, tokenData, err => {
                        if(!err){
                            callback(200);
                        }else{
                            callback(500, {'Error': 'Could not update the token!'});
                        }
                    });
                }else{
                    callback(400, {'Error': 'Token has been expired!'});
                }
            }else{
                callback(404)
            }
        });
    }else{
        callback(400, {'Error': 'Missing required field(s)!'});
    }
};
//Token delete method
handlers._tokens.delete = (data, callback) => {
    //Check id in the query string
    const tokenId = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 40 ? data.queryString.id.trim() : false;
    if(tokenId){
        //Get token by id
        _data.read('tokens', tokenId, (err, tokenData) => {
            if(!err && tokenData){
                //delete token
                _data.delete('tokens', tokenId, err => {
                    if(!err){
                        callback(200);
                    }else{
                        callback(500, {'Error': 'Could not delete the token!'});
                    }
                });
            }else{
                callback(404);
            }
        });
    }else{
        callback(400, {'Error': 'Missing required field(s)!'});
    }
};
//Verify tiken function
handlers.verifyToken = (tokenId, email, callback) => {
    //Get token by id
    _data.read('tokens', tokenId, (err, token) => {
        if(!err && token){
            //Check if token email equal given user email, and if token not expired.
            if(token.email == email && token.expires > Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    });
};

//Activate account handler
handlers.activate = (data, callback) => {
    if(data.method == 'get'){
        //Get hash from the query string
        const emailHash = typeof(data.queryString.hash) == 'string' && data.queryString.hash.trim().length > 0 ? data.queryString.hash.trim() : false;
        if(emailHash){
            //Get hash user from data
            _data.read('hashes', emailHash, (err, hashData) => {
                if(!err && hashData){
                    //Get user by email
                    _data.read('users', hashData.email+'@', (err, userData) => {
                        if(!err && userData){
                            userData.active = true;
                            //Activate user
                            _data.update('users', hashData.email+'@', userData, err => {
                                if(!err){
                                    //Delete hash from data
                                    _data.delete('hashes', emailHash, err => {
                                        if(!err){
                                            callback(200, {'Message': 'Thank you, you have just activated your account.'});
                                        }else{
                                            callback(500);
                                        }
                                    });
                                }else{
                                    callback(500);
                                }
                            });
                        }else{
                            callback(400);
                        }
                    });
                }else{
                    callback(404);
                }
            });
        }else{
            callback(400);
        }
    }else{
        callback(405);
    }
};

//Get menu (list).
handlers.menu = (data, callback) => {
    //Ensure acceptable method(s).
    if(data.method == 'get'){
        //Check token
        const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        _data.read('tokens', tokenId, (err, tokenData) => {
            if(!err && tokenData && tokenData.expires > Date.now()){
                //Check for query string id
                const itemId = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length > 0 ? data.queryString.id.trim() : false;
                if(itemId){
                    //Read item data
                    _data.read('menu', itemId, (err, itemData) => {
                        if(!err && itemData){
                            callback(200, itemData);
                        }else{
                            callback(404);
                        }
                    });
                }else{
                    //list menu items
                    _data.list('menu', (err, menuItems) => {
                        if(!err && menuItems){
                            //Read array of files
                            _data.readArr('menu', menuItems, (err, arrOfData) => {
                                if(!err && arrOfData){
                                    callback(200, arrOfData);
                                }else{
                                    callback(500, {'Error': err});
                                }
                            });
                        }else{
                            callback(500, {'Error': 'No items to list!'});
                        }
                    });
                }
            }else{
                callback(403, {'Error': 'Not valid token!'});
            }
        });
    }else{
        callback(405, {'Error': 'Not acceptable method!'});
    }
};


//Shopping card handler
handlers.cards = (data, callback) => {
    //Verify if method accepted
    const acceptedMethods = ['post', 'get', 'delete'];
    if(acceptedMethods.indexOf(data.method) > -1){
        handlers._cards[data.method](data, callback);
    }else{
        callback(405, {'Error': 'Not acceptable method'});
    }
};
//_cards object
handlers._cards = {};
//Cards post method
handlers._cards.post = (data, callback) => {
    //Check required data
    const itemId = typeof(data.payload.itemId) == 'string' && config.menuItemIds.indexOf(data.payload.itemId) > -1 ? data.payload.itemId : false;
    const quantity = typeof(data.payload.quantity) == 'number' && data.payload.quantity > 0 ? data.payload.quantity : false;
    const price = typeof(data.payload.price) == 'number' && data.payload.price > 0 ? data.payload.price : false;
    if(itemId && quantity && price){
        //Get email and token in the headers
        const email = typeof(data.headers.email) == 'string' ? data.headers.email : false;
        const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        //Validate email
        if(helpers.validateEmail(email)){
            //Verify token
            handlers.verifyToken(tokenId, email, isVerified => {
                if(isVerified){
                    //Read user data
                    _data.read('users', email+'@', (err, userData) => {
                        const userBasket = typeof(userData.basket) == 'object' && userData.basket instanceof Array ? userData.basket : [];
                        if(userBasket.length < config.maxCardsNumber){
                            //Set card data
                            const cardId = helpers.createToken(40);
                            const cardData = {
                                "id": cardId,
                                "email": email,
                                "item": itemId,
                                "quantity": quantity,
                                "price": price
                            };
                            //Create card
                            _data.create('cards', cardId, cardData, err => {
                                if(!err){
                                    userData.basket = userBasket;
                                    userData.basket.push(cardId);
                                    //Update user data
                                    _data.update('users', email+'@', userData, err => {
                                        if(!err){
                                            callback(200);
                                        }else{
                                            callback(500, {'Error': 'Error in updating user data with new card!'});
                                        }
                                    });
                                }else{
                                    callback(500, {'Error': 'Error in creating a new card!'});
                                }
                            });
                        }else{
                            callback(400, {'Error': 'You have set the maximum number of cards (7)!'});
                        }
                    });
                }else{
                    callback(403, {'Error': 'Not authorized!'});
                }
            });
        }else{
            callback(400, {'Error': 'Email in the headers is not valid!'});
        }
    }else{
        callback(400, {'Error': 'Missing required field(s)!'});
    }
};
//Get all cards method
handlers._cards.get = (data, callback) => {
    //Get user email and token in the headers
    const email = typeof(data.headers.email) == 'string' ? data.headers.email : false;
    const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    //Validate email
    if(helpers.validateEmail(email)){
        //Verify token
        handlers.verifyToken(tokenId, email, isVerified => {
            if(isVerified){
                //Read user data
                _data.read('users', email+'@', (err, userData) => {
                    if(!err && userData){
                        //Get cards in user basket
                        const userBasket = typeof(userData.basket) == 'object' && userData.basket instanceof Array ? userData.basket : false;
                        if(userBasket.length > 0){
                            //Read cards data in the user basket
                            _data.readArr('cards', userBasket, (err, cards) => {
                                if(!err && cards){
                                    callback(200, cards);
                                }else{
                                    callback(500, {'Error': 'Error in reading user basket cards data!'});
                                }
                            });
                        }else{
                            callback(404, {'Error': 'No cards in the basket!'});
                        }
                    }else{
                        callback(400, {'Error':'User with the given email is not exist!'});
                    }
                });
            }else{
                callback(403, {'Error': 'Not authorized!'});
            }
        });
    }else{
        callback(400, {'Error':'Email in the headers is not valid'});
    }
};
//Delete card method
handlers._cards.delete = (data, callback) => {
    //Get card id from query string
    const cardId = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 40 ? data.queryString.id.trim() : false;
    if(cardId){
        //Read card data
        _data.read('cards', cardId, (err, cardData) => {
            if(!err && cardData){
                //Set email and token for verification
                const email = cardData.email;
                const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                //Verify token
                handlers.verifyToken(tokenId, email, isVerified => {
                    if(isVerified){
                        //Delete card
                        _data.delete('cards', cardId, err => {
                            if(!err){
                                //Read user data
                                _data.read('users', email+'@', (err, userData) => {
                                    if(!err && userData){
                                        //Set user card position in user basket
                                        const userBasket = typeof(userData.basket) == 'object' && userData.basket instanceof Array ? userData.basket : false;
                                        const cardPosition = userBasket.indexOf(cardId);
                                        if(cardPosition > -1){
                                            //Remove card id from user basket
                                            userBasket.splice(cardPosition, 1);
                                            userData.basket = userBasket;
                                            //Update user data
                                            _data.update('users', email+'@', userData, err => {
                                                if(!err){
                                                    callback(200);
                                                }else{
                                                    callback(500, {'Error':'Error in deleting card id in user data!'});
                                                }
                                            });
                                        }else{
                                            callback(400, {'Error': 'No such a card to delete!'});
                                        }
                                    }else{
                                        callback(400, {'Error': 'No such a user!'});
                                    }
                                });
                            }else{
                                callback(500, {'Error': 'Could not delete the card!'});
                            }
                        });
                    }else{
                        callback(403, {'Error':'Not authorized!'});
                    }
                });
            }else{
                callback(404);
            }
        });
    }else{
        callback(400, {'Error': 'Missing card id in the query!'});
    }
};

//Orders handler
handlers.orders = (data, callback) => {
    //Verify if method accepted
    const acceptedMethods = ['post', 'get'];
    if(acceptedMethods.indexOf(data.method) > -1){
        handlers._orders[data.method](data, callback);
    }else{
        callback(405, {'Error': 'Not acceptable method'});
    }
};
//_order object
handlers._orders = {};
//Order post method
handlers._orders.post = (data, callback) => {
    //Check required data in the headers
    const email = typeof(data.headers.email) == 'string' ? data.headers.email : false;
    const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    //Validate email
    if(helpers.validateEmail(email)){
        //Verify token
        handlers.verifyToken(tokenId, email, isVerified => {
            if(isVerified){
                //Read user data
                _data.read('users', email+'@', (err, userData) => {
                    if(!err && userData){
                        //Check if user account is active
                        if(userData.active){
                            //Set user orders array
                            const userOrders = typeof(userData.orders) == 'object' && userData.orders instanceof Array ? userData.orders : [];
                            //Read cards data in user basket
                            _data.readArr('cards', userData.basket, (err, cards) => {
                                if(!err && cards && cards.length > 0){
                                    //Set total price
                                    let totalPrice = 0;
                                    cards.forEach(cardData => {
                                        totalPrice += cardData.price;
                                    });
                                    //Set order id
                                    const orderId = helpers.createToken(40);
                                    //Set order info
                                    const orderInfo = {
                                        "id": orderId,
                                        "email": email,
                                        "cards": cards,
                                        "price": totalPrice,
                                        "success": false,
                                        "date": Date.now() 
                                    };
                                    //Create order
                                    _data.create('orders', orderId, orderInfo, err => {
                                        if(!err){
                                        //Push order id to user orders
                                        userData.orders = userOrders;
                                        userData.orders.push(orderId);
                                        //Update user data
                                        _data.update('users', email+'@', userData, err => {
                                            if(!err){
                                                //Make stripe payment
                                                helpers.makeStripePayment({"price": totalPrice, "email": email}, err => {
                                                    if(!err){
                                                        //Send email
                                                        const emailData = {
                                                            "name": userData.lastName,
                                                            "email": email,
                                                            "subject": "Your delivery is received!",
                                                            "text": `Thanks Mr/Ms.${userData.lastName}. We have received your order. You have charged: ${totalPrice}$.`
                                                        };
                                                        helpers.sendMailgun(emailData, err => {
                                                            if(!err){
                                                                //Delete ordered cards
                                                                _data.deleteArr('cards', userData.basket, err => {
                                                                    if(!err){
                                                                        //Empty user basket
                                                                        userData.basket = [];
                                                                        //Update user data
                                                                        _data.update('users', email+'@', userData, err => {
                                                                            if(!err){
                                                                                //Set order success to true
                                                                                orderInfo.success = true;
                                                                                //Update order info
                                                                                _data.update('orders', orderId, orderInfo, err => {
                                                                                    if(!err){
                                                                                        callback(200);
                                                                                    }else{
                                                                                        callback(500, {'Error':'Could not update the order to success!'});
                                                                                    }
                                                                                });
                                                                            }else{
                                                                                callback(500, {'Error':'Could not empty user basket after deletion!'});
                                                                            }
                                                                        });
                                                                    }else{
                                                                        callback(500, {'Error':'Could not delete one or more of the cards in data!'});
                                                                    }
                                                                });
                                                            }else{
                                                                callback(400, {'Error':'Email not sent!'});
                                                            }
                                                        });
                                                    }else{
                                                        callback(400, {'Error':'Payment failed!'});
                                                    }
                                                });
                                            }else{
                                                callback(500,{'Error': 'Could not update user with a new order!'});
                                            }
                                        });
                                        }else{
                                            callback(500, {'Error':'Could not create a new order!'});
                                        }
                                    });
                                }else{
                                    callback(400, {'Error': 'No cards for order!'});
                                }
                            });
                        }else{
                            callback(400, {'Error':'User has not activated his/her account yet!'});
                        }
                    }else{
                        callback(400, {'Error':'User with the given email is not existed!'});
                    }
                });
            }else{
                callback(403, {'Error':'Not authorized!'});
            }
        });
    }else{
        callback(400, {'Error':'Email in the headers is not valid!'});
    }
};
//Get all orders per user method
handlers._orders.get = (data, callback) => {
    //Check email in query string
    const email = typeof(data.queryString.email) == 'string' ? data.queryString.email :  false;
    if(email && helpers.validateEmail(email)){
        //Check token in the header
        const tokenId = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        //Verify token
        handlers.verifyToken(tokenId, email, isVerified => {
            if(isVerified){
                //Read user data
                _data.read('users', email+'@', (err, userData) => {
                    if(!err && userData){
                        //Read data for user orders
                        _data.readArr('orders', userData.orders, (err, ordersData) => {
                            if(!err && ordersData){
                                callback(200, ordersData);
                            }else{
                                callback(400, {'Error': 'User has no orders!'});
                            }
                        });
                    }else{
                        callback(400, {'Error': 'No such a user!'});
                    }
                });
            }else{
                callback(403, {'Error':'Not authorized, or token in headers is not valid!'});
            }
        });
    }else{
        callback(400, {'Error':'Valid email is required!'});
    }
};


//Export Handlers
module.exports = handlers;