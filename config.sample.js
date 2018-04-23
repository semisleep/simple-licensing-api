let config = {};

config.production = true;

config.web = {
  port: 3352,
  resourceAge: 1000 * 60 * 60 // an hour
};

config.sessionSecret = 'a_top_secret';

config.mongo = {
  connectionString: 'mongodb://localhost/simple-licensing-api',
  connectionOptions: {}
};

module.exports = config;

