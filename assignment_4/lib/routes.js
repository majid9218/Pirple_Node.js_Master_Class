/* Pizza Delivary API Routes */

//Routes
const routes = (handlers) => ({
    //Client routes
    '': handlers.client.index,
    'account/create': handlers.client.accountCreate,
    'account/edit': handlers.client.accountEdit,
    'account/delete': handlers.client.accountDelete,
    'session/create': handlers.client.sessionCreate,
    'items': handlers.client.items,
    'basket': handlers.client.basket,
    'delivery': handlers.client.delivery,
    'orders': handlers.client.orders,
    'succeeded': handlers.client.succeeded,

    //Ping
    'ping': handlers.ping,

    //API routes
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/activate': handlers.activate,
    'api/menu': handlers.menu,
    'api/cards': handlers.cards,
    'api/orders': handlers.orders,

    //Public routes
    'favicon': handlers.client.favicon,
    'public': handlers.client.public
});
 
//Export Routes
module.exports = routes;