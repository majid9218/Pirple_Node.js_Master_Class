/* Pizza Delivery Front End Javascript Application */

//Set app object
const app = {};

//Set app configration
app.config = {
    'sessionToken' : false
}

//Set ajax client object
app.client = {};

//Set ajax request function
app.client.ajax = (headers, path, method, queryStringObject, payload, callback) => {
    //Set parameters
    headers = typeof(headers) == 'object' && headers !== null ? headers : {};
    path = typeof(path) == 'string' && path.length > 0 ? path : '/';
    method = typeof(method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method : 'GET';
    queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof(payload) == 'object' && payload !== null ? payload : {};
    callback = typeof(callback) == 'function' ? callback : false;
    //Add queries to the request url
    let requestUrl = path + '?';
    let counter = 0;
    for(let queryKey in queryStringObject){
        if(queryStringObject.hasOwnProperty(queryKey)){
            counter++;
            if(counter > 1){
                requestUrl = requestUrl + '&';
            }
            requestUrl = requestUrl + queryKey + '=' + queryStringObject[queryKey];
        }
    }
    //Crete XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    //Set content type json in xhr header
    xhr.setRequestHeader('Content-Type', 'application/json');
    //Add headers to request header
    for(let key in headers){
        if(headers.hasOwnProperty(key)){
            xhr.setRequestHeader(key, headers[key]);
        }
    }
    //Add token and email to headers if exist
    if(app.config.sessionToken){
        xhr.setRequestHeader('token', app.config.sessionToken.id);
        xhr.setRequestHeader('email', app.config.sessionToken.email);
    }
    //When request state changes
    xhr.onreadystatechange = () => {
        if(xhr.readyState == XMLHttpRequest.DONE){
            const statusCode = xhr.status;
            const resText = xhr.responseText;
            //If there is a callback
            if(callback){
                try{
                    const parsedResponse = JSON.parse(resText);
                    callback(statusCode, parsedResponse);
                }catch(e){
                    callback(statusCode, false);
                }
            }
        }
    };
    //Send xhr request
    const payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
};

//Bind sanwitch menu
app.bindSandwitchMenu = () => {
    document.querySelector('.sandwitch_off').addEventListener('click', function(e){
        this.style.display = 'none';
        document.querySelector('.sandwitch_on').style.display = 'inline';
        document.querySelector('header > ul').style.display = 'flex';
    });
};

//Bind exit menu btn
app.bindExitMenuBtn = () => {
    document.querySelector('.exit_menu').addEventListener('click', function(e){
        document.querySelector('.sandwitch_on').style.display = 'none';
        document.querySelector('.sandwitch_off').style.display = 'inline';
        document.querySelector('header > ul').style.display = 'none';
    });
}

//Bind forms function
app.bindForms = () => {
    if(document.querySelector('form')){
        console.log('yes');
        const allForms = document.querySelectorAll('form');
        allForms.forEach(form => {
            form.addEventListener('submit', function(e){
                e.preventDefault();
                //Set form id, method and path
                const formId = this.id;
                const path = this.action;
                let method = this.method.toUpperCase();
                //Hide error if displayed
                document.querySelector('#'+formId+' .error').style.display = 'none';
                //Hide success message if displayed
                if(document.querySelector("#"+formId+" .success")){
                    document.querySelector("#"+formId+" .success").style.display = 'none';
                }
                //Set the payload
                const payload = {};
                let fulladdress = '';
                let allPrice = 0;
                const elements = this.elements;
                for(let i=0; i<elements.length; i++){
                    if(elements[i].type !== 'submit'){
                        let elementClasses = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
                        let elementValue = elements[i].type == 'checkbox' && elementClasses.indexOf('multiselect') == -1 ? elements[i].checked : elementClasses.indexOf('intval') == -1 ? elements[i].value : parseFloat(elements[i].value);
                        let elementName = elements[i].name;
                        if(elementName == '_method'){
                            method = elementValue;
                        }
                        if(elementName == 'address'){
                            fulladdress += elementValue + '.';
                            elementValue = fulladdress;
                        }
                        if(elementName == 'price' && elements[i].checked){
                            allPrice += elementValue;
                        }
                        if(elementName == 'quantity'){
                            elementValue = parseInt(elementValue);
                        }
                        payload[elementName] = elementValue;
                        payload.price = allPrice;
                    }
                }
                // If the method is DELETE, the payload should be a queryStringObject instead
                const queryStrObj = method == 'DELETE' ? payload : {};
                //Make ajax request
                app.client.ajax(undefined, path, method, queryStrObj, payload, (statusCode, responsePayload) => {
                    if(statusCode !== 200){
                        //Dispaly error
                        const error = typeof(responsePayload.Error) == 'string' && responsePayload.Error.length > 0 ? responsePayload.Error : 'An error occurred. Please, Try again later!';
                        document.querySelector('#'+formId+' .error').innerHTML = error;
                        document.querySelector('#'+formId+' .error').style.display = 'block';
                    }else{
                        //Pocessing
                        app.processFormResponse(formId, payload, responsePayload);
                    }
                });
            });
        });
    }
};

// Process form response function
app.processFormResponse = (formId, RequestPayload, responsePayload) => {
    //If form id is account_create
    if(formId == 'account_create'){
        //Log user in
        const loginPayload = {
            'email': RequestPayload.email,
            'password': RequestPayload.password
        }
        app.client.ajax(undefined, '/api/tokens', 'POST', undefined, loginPayload, (statusCode, tokenData) => {
            if(statusCode !== 200){
                const error = typeof(tokenData.Error) == 'string' && tokenData.Error.length > 0 ? tokenData.Error : 'An error occurred. Please, Try again later!';
                document.querySelector('#'+formId+' .error').innerHTML = error;
                document.querySelector('#'+formId+' .error').style.display = 'block';
            }else{
                app.setSessionToken(tokenData);
                window.location = '/items';
            }
        });
    }
    //If form id is session_create
    if(formId == 'session_create'){
        app.setSessionToken(responsePayload);
        window.location = '/items';
    }
    //If fom id is one of item forms
    if(['menuItem1', 'menuItem2', 'menuItem3', 'menuItem4', 'menuItem5', 'menuItem6', 'menuItem7'].indexOf(formId) > -1){
        //Set basket
        app.setBasket();
    }
    //If form id is for edit
    if(['accountEdit1', 'accountEdit2'].indexOf(formId) > -1){
        document.querySelector("#"+formId+" .success").style.display = 'block';
    }
    //If form id is account delete
    if(formId == 'accountEdit3'){
        app.logUserOut(true);
    }
    //If form id contain _deletion
    if(formId.indexOf('deletion_') > -1){
        location.reload();
    }
}

//Set basket function
app.setBasket = () => {
    const email = typeof(app.config.sessionToken.email) == 'string' && app.config.sessionToken.email.length > 0 ? app.config.sessionToken.email : false;
    if(email){
        const queryStrObj = {
            'email': app.config.sessionToken.email
        }
        app.client.ajax(undefined, '/api/users', 'GET', queryStrObj, undefined, (statusCode, userData) => {
            if(statusCode == 200 && userData){
                if(userData.basket.length > 0){
                    document.querySelector('.basket').style.display = 'inline-block';
                    document.querySelector('.basket > p').innerHTML = userData.basket.length;
                }
            }
        });
    }else{
        console.log(email);
    }
};

//Set session token fuction
app.setSessionToken = (token) => {
    token = typeof(token) == 'object' && token !== null ? token : false;
    //Add token to local storage
    app.config.sessionToken = token;
    const tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
    //Set app config session token
    if(token){
        //Log in user
        app.logUserIn(true);
    }else{
        app.logUserIn(false);
    }
};

//Get session token function
app.getSessionToken = () => {
    //Get token from local storage
    const token = localStorage.getItem('token');
    try{
        //Parse token
        const parsed = JSON.parse(token);
        app.config.sessionToken = parsed;
        if(typeof(parsed) == 'object' && parsed !== null){
            //Log user in
            app.logUserIn(true);
            //Set user data
            app.client.ajax(undefined, '/api/users', 'GET', {'email': parsed.email}, undefined, (statusCode, userData) => {
                if(statusCode == 200 && userData){
                    app.config.userData = userData;
                }
            });
        }else{
            //Log user out
            app.logUserIn(false);
        }
    }catch(e){
        //Log user out
        app.config.sessionToken = false;
        app.logUserIn(false);
    }
};

//Log user in function
app.logUserIn = (add) => {
    const target = document.querySelector("body");
    if(add){
        target.classList.add('login');
    } else {
        target.classList.remove('login');
    }
};

// Bind the logout button
app.bindLogoutButton = () => {
    document.getElementById("logoutButton").addEventListener("click", (e) => {
      // Stop it from redirecting anywhere
      e.preventDefault();
      // Log the user out
      app.logUserOut();
    });
};

// Log the user out then redirect them
app.logUserOut = (redirectToDelete) => {
    //Set redirect boolean
    redirectToDelete = typeof(redirectToDelete) == 'boolean' ? redirectToDelete : false;
    //Get the current token id
    const tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;
    //Send the current token to the tokens endpoint to delete it
    var queryStringObject = {
        'id' : tokenId
    };
    app.client.ajax(undefined, '/api/tokens', 'DELETE', queryStringObject, undefined, (statusCode,responsePayload) =>{
        //Set the app.config token as false
        app.setSessionToken(false);
        //Redirect user
        if(redirectToDelete){
            window.location = '/account/delete';
        }else{
            window.location = '/session/create';
        }
        
    });
};

//Load data on page
app.loadDataOnPage = () => {
    //Get body classes
    const bodyClasses = document.querySelector('body').classList;
    const primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;
    //If primaryClass is menuItems:
    if(primaryClass == 'menuItems'){
        //Load menu Data
        app.loadMenuData();
        //Set basket
        app.setBasket();
    }
    //If primaryClass is accountEdit
    if(primaryClass == 'accountEdit'){
        //Load data on edit form
        app.loadSettingsPage();
    }
    //If primaryClass is placeOrder
    if(primaryClass == 'placeOrder'){
        //Load cards on page
        app.loadOrderCards();
    }
    
};

//Load cards on page function
app.loadOrderCards = () => {
    //Hide order error
    document.querySelector('.order_error').style.display = 'none';
    //Get user cards
    app.client.ajax(undefined, '/api/cards', 'GET', undefined, undefined, (statusCode, userCards) => {
        if(statusCode !== 200){
            //Direct to session create if there is no token
            if(app.config.sessionToken == false){
                window.location = '/session/create';
            }
            //Hide place order btn
            document.querySelector('.order_details').style.display = 'none';
        }else{
            //Set counter
            let counter = 0;
            //Hide no cards message
            document.querySelector('.no_cards').style.display = 'none';
            //For each item in user bascket get item data from menu
            userCards.forEach(card => {
                //Set query string object
                let queryStrObj = {
                    'id': card.item
                }
                //Get item from menu
                app.client.ajax(undefined, '/api/menu', 'GET', queryStrObj, undefined, (statusCode, itemData) => {
                    if(statusCode == 200){
                        counter++;
                        app.createCardElement(card, itemData);
                        //Binding forms
                        if(counter == userCards.length){
                            app.bindForms();
                        }
                    }
                });
            });
            //Load order data
            app.loadOrderData(userCards);
        }
    });
}

//Load order data function
app.loadOrderData = (userCards) => {
    //Set total price
    let totalPrice = 0;
    userCards.forEach(card => {
        totalPrice = totalPrice + card.price;
    });
    //Set order details
    if(typeof(app.config.userData) == 'object' && app.config.userData !== null){
        document.querySelector('.order_value_user').innerHTML = app.config.userData.email;
        document.querySelector('.order_value_address').innerHTML = app.config.userData.address;
    }
    document.querySelector('.order_value_price').innerHTML = totalPrice + ' $';
    app.bindPlaceOrderBtn(totalPrice);
};

//Create card element function
app.createCardElement = (card, itemData) => {
    //Create list item
    const li = document.createElement('li');
    //Create div with class displayed_card
    const divCard = document.createElement('div');
    divCard.className = 'displayed_card';
    /* Inside displayed_card div create h4, p, hr and div */
    //h4
    const h4 = document.createElement('h4');
    const itemName = document.createTextNode(itemData.name);
    h4.appendChild(itemName);
    //p
    const p = document.createElement('p');
    const description = document.createTextNode(itemData.ingredients);
    p.appendChild(description);
    //hr
    const hr = document.createElement('hr');
    //div with class name quant_price_delete
    const qpDiv = document.createElement('div');
    qpDiv.className = 'quant_price_delete';
    //Create div inside qpDiv with class name quant_price
    const quantityPriceDiv = document.createElement('div');
    quantityPriceDiv.className = 'quant_price';
    //Inside quantityPriceDiv create h5 for quantity and h5 for price
    const quantH5 = document.createElement('h5');
    const priceH5 = document.createElement('h5');
    const quantNum = document.createTextNode('Quantity: ' + card.quantity);
    const priceNum = document.createTextNode('Price: ' + card.price + ' $');
    quantH5.appendChild(quantNum);
    priceH5.appendChild(priceNum);
    //Appending h5s to quantityPriceDiv
    quantityPriceDiv.appendChild(quantH5);
    quantityPriceDiv.appendChild(priceH5);
    //Appending quantityPriceDiv to qpDiv
    qpDiv.appendChild(quantityPriceDiv);
    //Create card deletion form
    const cardDeletionForm = document.createElement('form');
    cardDeletionForm.setAttribute('id', 'deletion_' + card.id);
    cardDeletionForm.setAttribute('action', "/api/cards");
    cardDeletionForm.setAttribute('method', "DELETE");
    /* Create form inputs */
    //Hidden method input
    const hiddenMethod = document.createElement('input');
    hiddenMethod.setAttribute('type', "hidden");
    hiddenMethod.setAttribute('name', "_method");
    hiddenMethod.setAttribute('value', "DELETE");
    //Hidden cardId input
    const hiddenCardId = document.createElement('input');
    hiddenCardId.setAttribute('type', "hidden");
    hiddenCardId.setAttribute('name', "cardId");
    hiddenCardId.setAttribute('value', card.id);
    //Deletion button
    const cardDeletionButton = document.createElement('button');
    cardDeletionButton.className = 'card_delete_btn';
    cardDeletionButton.setAttribute('type', 'submit');
    const cardDeletionButtonName = document.createTextNode('Delete Card');
    cardDeletionButton.appendChild(cardDeletionButtonName);
    //Error div
    const deletionErrorDiv = document.createElement('div');
    deletionErrorDiv.classList.add('error');
    deletionErrorDiv.classList.add('card_del_error');
    //Appending created form elements to card deletion form
    cardDeletionForm.appendChild(hiddenMethod);
    cardDeletionForm.appendChild(hiddenCardId);
    cardDeletionForm.appendChild(cardDeletionButton);
    cardDeletionForm.appendChild(deletionErrorDiv);
    //Appending card deletion form to qpDiv
    qpDiv.appendChild(cardDeletionForm);
    /* Appending created h4, p, hr and div to displayed_card */
    divCard.appendChild(h4);
    divCard.appendChild(p);
    divCard.appendChild(hr);
    divCard.appendChild(qpDiv);
    //Appending divCard to li
    li.appendChild(divCard);
    //Appending created li to (user_cards) ul
    document.querySelector('.user_cards').appendChild(li);
};

//Bind place order button
app.bindPlaceOrderBtn = (totalAmount) => {
    document.getElementById("place_order_btn").addEventListener('click', (e) => {
        // Open Checkout with further options:
        app.stripeHandler.open({
          name: 'Pizza Delivery',
          description: 'Powered by stripe.com',
          zipCode: true,
          amount: totalAmount * 100
        });
        e.preventDefault();
      });
};

//Load settings page function
app.loadSettingsPage = () => {
    const email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
    if(email){
        //Set query String object
        const queryStrObj = {
            'email': email
        };
        //Get uset data
        app.client.ajax(undefined, '/api/users', 'GET', queryStrObj, undefined, (statusCode, userData) => {
            if(statusCode !== 200){
                app.logUserOut();
            }else{
                //Split address to array
                const addressArr = userData.address.split('.');
                //Set data on settings page
                document.querySelector('#accountEdit1 .emailInput').value = userData.email;
                document.querySelector('#accountEdit1 .firstNameInput').value = userData.firstName;
                document.querySelector('#accountEdit1 .lastNameInput').value = userData.lastName;
                document.querySelector('#accountEdit1 .addressLine1').value = addressArr[0];
                document.querySelector('#accountEdit1 .addressLine2').value = addressArr[1];
                document.querySelector('#accountEdit1 .addressLine3').value = addressArr[2];
                document.querySelector('#accountEdit1 .addressLine4').value = addressArr[3];
                //Set hidden email value
                const hiddens = document.querySelectorAll('input.hiddenEmail');
                for(let i=0; i<hiddens.length; i++){
                    hiddens[i].value = userData.email;
                }
            }
        });
    }else{
        app.logUserOut();
    }
};

//Load menu Data function
app.loadMenuData = () => {
    //Get menu items
    app.client.ajax(undefined, '/api/menu', 'GET', undefined, undefined, (statusCode, menuItems) => {
        if(statusCode !== 200){
            //Set the app.config token as false
            app.setSessionToken(false);
            //Send the user to the home page
            window.location = '/session/create';
        }else{
            //Display menu items
            app.displayMenuItems(menuItems);
            //Bind create card button
            app.bindCreateCardBtns();
            //Bind close card button
            app.bindCloseCardBtns();
            //Bind forms
            app.bindForms();
        }
    });
};

//Display menu items function
app.displayMenuItems = (items) => {
    //Create item components
    items.forEach(item => {
        //Create li for each item
        let li = document.createElement('li');
        li.className = 'item';
        //Create div for picture
        let picDiv = document.createElement('div');
        picDiv.className = 'item_pic';
        picDiv.setAttribute('style', `background-image: url(${item.urlImage});`);
        //Create div for details
        let detDiv = document.createElement('div');
        detDiv.className = 'item_details';
        //Details
        let h3 = document.createElement('h3');
        let name = document.createTextNode(`${item.name}`);
        h3.appendChild(name);
        let ingredients = document.createElement('p');
        let ingred = document.createTextNode(`${item.ingredients}`);
        ingredients.appendChild(ingred);
        detDiv.appendChild(h3);
        detDiv.appendChild(ingredients);
        //Item form
        let form = document.createElement('form');
        form.className = 'card_form';
        form.setAttribute('id', `${item.id}`);
        form.setAttribute('action', '/api/cards');
        form.setAttribute('method', 'POST');
        form.setAttribute('style', 'display: none;')
        //Set form itemId
        let itemId = document.createElement('input');
        itemId.className = 'hiddenItemId';
        itemId.setAttribute('type', 'hidden');
        itemId.setAttribute('name', 'itemId');
        itemId.setAttribute('value', `${item.id}`);
        //Size checkboxes
        let sizeDiv = document.createElement('div');
        sizeDiv.className = 'form_wrapper';
        sizeDiv.classList.add('set_margin');
        let h4size = document.createElement('h4');
        let size = document.createTextNode('Select size');
        h4size.appendChild(size);
        sizeDiv.appendChild(h4size);
        let checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'checkboxGroup';
        //Set pizza sizes and prices in checkboxes
        for(let key in item.prices){
            if(item.prices.hasOwnProperty(key)){
                let checkDiv = document.createElement('div');
                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('name', 'price');
                checkbox.setAttribute('value', `${item.prices[key]}`);
                checkbox.classList.add('multiselect');
                checkbox.classList.add('intval');
                let sizePrice = document.createTextNode(` ${item.prices[key].toFixed(2)}$ - ${key}`);
                checkDiv.appendChild(checkbox);
                checkDiv.appendChild(sizePrice);
                checkboxGroup.appendChild(checkDiv);
            }
        }
        sizeDiv.appendChild(checkboxGroup);
        //Quantity div
        let quantDiv = document.createElement('div');
        quantDiv.className = 'form_wrapper';
        let h4quantity = document.createElement('h4');
        let selectQuantity = document.createTextNode('Select Quantity');
        h4quantity.appendChild(selectQuantity);
        quantDiv.appendChild(h4quantity);
        let quantityInput = document.createElement('input');
        quantityInput.setAttribute('type', 'number');
        quantityInput.setAttribute('name', 'quantity');
        quantityInput.setAttribute('min', '1');
        quantityInput.setAttribute('max', '20');
        quantityInput.setAttribute('value', '1');
        quantDiv.appendChild(quantityInput);
        //Submit button
        let buttonDiv = document.createElement('div');
        buttonDiv.className = 'form_wrapper';
        let submitButton = document.createElement('button');
        submitButton.className = 'btn';
        submitButton.setAttribute('type', 'submit');
        let submitButtonText = document.createTextNode('Add Card To Baskest');
        submitButton.appendChild(submitButtonText);
        buttonDiv.appendChild(submitButton);
        //Close form buttom 
        let closeBtn = document.createElement('div');
        closeBtn.className = 'close_btn';
        let closeSpan = document.createElement('span');
        let closeText = document.createTextNode('x');
        closeSpan.appendChild(closeText);
        closeBtn.appendChild(closeSpan);
        //Form error div
        let errorDiv = document.createElement('div');
        errorDiv.className = 'form_wrapper';
        errorDiv.classList.add('set_margin2');
        let error = document.createElement('div');
        error.className = 'error';
        errorDiv.appendChild(error);
        //Form appending
        form.appendChild(closeBtn);
        form.appendChild(errorDiv);
        form.appendChild(itemId);
        form.appendChild(sizeDiv);
        form.appendChild(quantDiv);
        form.appendChild(buttonDiv);
        detDiv.appendChild(form);
        //Add to basket button
        let button = document.createElement('button');
        button.className = 'btn';
        button.classList.add('create_card');
        let add = document.createTextNode('Create Card');
        button.appendChild(add);
        detDiv.appendChild(button);
        ////
        li.appendChild(picDiv);
        li.appendChild(detDiv);
        document.querySelector('.list').appendChild(li);
    });
};

//Bind create card button function
app.bindCreateCardBtns = () => {
    const btns = document.querySelectorAll('.create_card');
    for(let i=0; i<btns.length; i++){
        btns[i].addEventListener('click', function(e){
            e.target.style.display = 'none';
            e.target.parentNode.childNodes[2].style.display = 'inline-block';
            e.target.parentNode.parentNode.style.backgroundColor = '#F3F3F3'
        });
    }
};

//Bind Close card button function
app.bindCloseCardBtns = () => {
    const btns = document.querySelectorAll('.close_btn > span');
    for(let i=0; i<btns.length; i++){
        btns[i].addEventListener('click', function(e){
            e.target.parentNode.parentNode.style.display = 'none';
            e.target.parentNode.parentNode.parentNode.childNodes[3].style.display = 'inline-block';
            e.target.parentNode.parentNode.parentNode.parentNode.style.backgroundColor = '#fff';
        });
    }
};

//Set stripe handler function
app.setStripeHndler = () => {
    //Stripe checkout handler
    app.stripeHandler = StripeCheckout.configure({
        key: 'pk_test_Lbceh59zVbhjZnNDdetx50zR',
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function(token) {
            document.querySelector('.spinner').style.display = 'inline-block';
            app.client.ajax(undefined, '/api/orders', 'POST', undefined, undefined, (statusCode, err) => {
                if(statusCode == 200){
                    document.querySelector('.spinner').style.display = 'none';
                    window.location = '/succeeded'
                }else{
                    document.querySelector('.spinner').style.display = 'none';
                    document.querySelector('.order_error').style.display = 'inline';
                }
            });
        }
    });
};

app.renewToken = callback => {
    //Set current token
    const currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
    if(currentToken){
        //Set payload
        const payload = {
            'id': currentToken.id,
            'extended': true
        };
        //Update token
        app.client.ajax(undefined, '/api/tokens', 'PUT', undefined, payload, statusCode => {
            if(statusCode == 200){
                //Set queryStringObj
                const queryStringObj = {'id': currentToken.id};
                //Get token
                app.client.ajax(undefined, 'api/tokens', 'GET', queryStringObj, undefined, (statusCode, tokenData) => {
                    if(statusCode == 200){
                        app.setSessionToken(tokenData);
                        callback(false);
                    }else{
                        //Set token to false 
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            }else{
                //Set token to false 
                app.setSessionToken(false);
                callback(true);
            }
        });
    }else{
        //Set token to false 
        app.setSessionToken(false);
        callback(true);
    }
}

//Token Renewal loop function
app.tokenRenewalLoop = () => {
    //Set interval every min
    setInterval(() => {
        //Renew token
        app.renewToken(err => {
            if(!err){
                console.log('Token has been renewed successfully!')
            }
        });
    }, 1000 * 60);
};

//App init function
app.init = () => {
    //Bind sandwitch menu
    app.bindSandwitchMenu();
    //Bind exit menu btn
    app.bindExitMenuBtn();
    //Set stripe handler function
    app.setStripeHndler();
    //Bind forms
    app.bindForms();
    //Bind loggout button
    app.bindLogoutButton();
    //Get session token
    app.getSessionToken();
    //Token Renewal loop
    app.tokenRenewalLoop();
    //Load data on page
    app.loadDataOnPage();
};

//Call init function after window load
window.onload = () => {
    app.init();
};

//Window onresize
window.onresize = (e) => {
    if(screen.width > 768){
        document.querySelector('.sandwitch').style.display = 'none';
        document.querySelector('header > ul').style.display = 'flex';
    }
};
