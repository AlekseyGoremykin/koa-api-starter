const Router = require('@koa/router');

const router = new Router();

require('./get-writer').register(router);
require('./get-writers').register(router);
require('./add-writer').register(router);
require('./delete-writer').register(router);
require('./update').register(router);
require('./writer-books').register(router);

module.exports = router.routes();
