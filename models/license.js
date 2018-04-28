'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let LicenseKeySchema = new Schema({
  _owner: {type: Schema.Types.ObjectId, ref: 'User', index: true},
  key: {type: String, index: true},
  maxUsage: {type: Number, default: 1},
  currentUsage: {type: Number, default: 0},
  devices: [{
    identifier: String,
    extra: String
  }],
  createdAt: {type: Date, default: Date.now},
  lastValidatedAt: Date
});

let License = mongoose.model('License', LicenseKeySchema);

module.exports.Model = License;
