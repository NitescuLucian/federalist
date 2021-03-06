const express = require('express');

const mainRouter = express.Router();

mainRouter.use(require('./auth'));
mainRouter.use(require('./main'));
mainRouter.use(require('./preview'));
mainRouter.use(require('./webhook'));

const apiRouter = express.Router();
apiRouter.use(require('./build-log'));
apiRouter.use(require('./build'));
apiRouter.use(require('./published-branch'));
apiRouter.use(require('./site'));
apiRouter.use(require('./user'));
apiRouter.use(require('./published-file'));

// prefix all api routes with "/v0"
mainRouter.use('/v0', apiRouter);

module.exports = mainRouter;
