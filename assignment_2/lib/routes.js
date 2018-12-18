/* Pizza Delivary API Routes */

//Routes
const routes = (handlers) => ({
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/activate': handlers.activate,
    'api/menu': handlers.menu,
    'api/cards': handlers.cards,
    'api/orders': handlers.orders
});
 
//Export Routes
module.exports = routes;