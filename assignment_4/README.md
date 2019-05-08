# Pizza Delivery API with Frontend and CLI

By this api you can create users with emails. The user can fill shopping cards with a menu item and quantity (There is 7 items in the menu). The user can create one ore more, up to 7 cards before he makes the order. After making the order, the user will recieve an email.

## Installation

You can clone or download it directly from github.

```bash
$ git clone https://github.com/USERNAME/REPOSITORY
```

## Usage

### Users route: (api/users)

You can POST, GET, PUT and DELETE users.

``` javascript
//Create a new user - required data
var payload = {
    "firstName": "USER FIRST NAME",
    "lastName": "USER LAST NAME",
    "email": "USER EMAIL",
    "address": "USER ADDRESS",
    "password": "USER PASSWORD",
    "tosAgreement": true
}

//Get user required data 
/* 
Include user email as query
api/users?email=USER_EMAIL
*/

//Update user payload. One optional is required
var payload = {
    "email": "USER EMAIL", //required
    "firstName": "USER FIRST NAME", // optional
    "lastName": "USER LAST NAME", //optional
    "address": "USER ADDRESS", // optional
    "password": "USER PASSWORD", // optional
}

//Delete user required data 
/* 
Include user email as query
api/users?email=USER_EMAIL
*/
```

### Sessions route: (api/tokens)

You can POST, GET, PUT and DELETE tokens.

``` javascript
//Create a new token - required data
var payload = {
    "email": "USER EMAIL",
    "password": "USER PASSWORD"
}

//Get token data 
/* 
Include token id as query
api/tokens?id=TOKEN_ID
*/

//Update token payload - required data
var payload = {
    "id": "TOKEN_ID",
    "extended": true // This will extend the session one hour more.
}

//Delete token/session
/* 
Include token id as query
api/tokens?id=TOKEN_ID
*/
```

### menu route: (api/menu)

You can only GET, menu list or menu item by id: menuItem1, menuItem2, menuItem3, menuItem4, menuItem5, menuItem6 or menuItem7.

``` javascript
//menu example:
const menuItem1 = {
    "id": "menuItem1",
    "name": "Pepperoni",
    "ingredients": "Mozzarella Cheese, Tomato sauce and Pepperoni.",
    "prices": {
        "small": 3.5,
        "medium": 5.5,
        "large": 7,
        "x-large": 9
    },
    "urlImage": "http://pngimg.com/uploads/pizza/pizza_PNG44071.png"
}

//Get menu list
/* 
Include token id in headers
*/
const headers = {
    "id": "TOKEN_ID"
}

//Get menu item
/* 
Include token id in headers and item id as query:
api/menu?id=menuItem1
*/
const headers = {
    "id": "TOKEN_ID"
}
```

### cards route: (api/cards)

You can POST, GET and DELETE cards

```javascript
//Post new card - required data
const headers = {
    "token": "TOKEN_ID",
    "email": "USER_EMAIL"
}
const payload = {
    "itemId": "ITEM_ID", // menuItem1, menuItem2 ...
    "quantity" : 1 // any number more than zero
    "price" : 0.99 // any number more than zero
}

//Get all cards in user basket 
/* 
Include token and user email in the headers
*/
const headers = {
    "token": "TOKEN_ID",
    "email": "USER_EMAIL"
}

//Delete card in the user basket
/* 
Include token and user email in the headers, and card id as query:
api/cards?id=CARD_ID
*/
const headers = {
    "token": "TOKEN_ID",
    "email": "USER_EMAIL"
}
```

### orders route: (api/orders)

You can POST new order and GET list of orders per user.

```javascript
//Post an order
/* Include token and user email in the headers */
const headers = {
    "token": "TOKEN_ID",
    "email": "USER_EMAIL"
}

//Get all orders - per user
/*
 Include token in the headers, and user email as query: 
 api/orders?email=USER_EMAIL
 */
const headers = {
    "token": "TOKEN_ID"
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)