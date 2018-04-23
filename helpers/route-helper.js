'use strict';

const _ = require('lodash');
const logHelper = require('./log-helper');
const config = require('../config');

function wrapJsonError(router) {
  wrapJsonErrorForAction(router, 'get');
  wrapJsonErrorForAction(router, 'post');
  wrapJsonErrorForAction(router, 'put');
  wrapJsonErrorForAction(router, 'delete');
  return router;
}

function wrapJsonErrorForAction(router, actionName) {
  const action = router[actionName];
  router[actionName] = function () {
    const args = Array.prototype.slice.apply(arguments);
    const last = args[args.length - 1];
    args[args.length - 1] = async (req, res) => {
      try {
        await last.call(null, req, res);
      } catch(e) {
        logHelper.error('Error handling JSON request:', e);
        if (_.isString(e)) {
          // if error is simply a string, treat it as invalid argument error which would be displayed to client directly
          res.status(400).json({message: e});
        } else {
          res.status(e.status || 500).json({
            key: e.key,
            message: e.message,
            error: config.production ? null : e.stack
          });
        }
      }
    };
    action.apply(router, args);
  };
}

module.exports = {
  wrapJsonError
};
