'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: {type: String, unique: true},
  passwordHash: String,
  passwordSalt: String,
  apiKey: String,
  maxLicenseNum: {type: Number, default: 200}
});

UserSchema.index({code: 1, date: 1});

let User = mongoose.model('User', UserSchema);

module.exports.Model = User;
