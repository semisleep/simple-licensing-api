#!/usr/bin/env node
'use strict';

const models = require('../models');
const app = require('../app');
const config = require('../config');

(async () => {
  await models.ready();

  app.set('port', config.web.port || 80);
  let server = app.listen(app.get('port'), () => {
    console.log('Express server listening on port ', server.address().port);
  });
  server.timeout = 1000 * 60 * 10;
})();

