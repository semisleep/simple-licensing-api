'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const config = require('../config');

//mongoose.set('debug', true);

mongoose.Promise = Promise;

function ready() {
    if (!ready.promise) {
        ready.promise = mongoose.connect(config.mongo.connectionString, config.mongo.connectionOptions);
    }
    return ready.promise;
}

let models = {
  ready,
  User: require('./user').Model,
  License: require('./license').Model
};

for (let key of _.keys(models)) {
  if (models[key].on) {
    models[key].on('index', function(err) {
      if (err) {
        utils.error(`Error creating index for ${key}.`, err);
      }
    });
  }
}

module.exports = models;
