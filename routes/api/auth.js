'use strict';

const _ = require('lodash');
const express = require('express');
const uuid = require('node-uuid');
const crypto = require('crypto');
const routeHelper = require('../../helpers/route-helper');
const models = require('../../models');

let router = routeHelper.wrapJsonError(express.Router());

router.post('/register', async (req, res) => {
  let data = _.pick(req.body, ['email', 'password']);
  if (!data.email || !data.password) {
    throw {status: 400};
  }
  let count = await models.User.count({email: data.email}).exec();
  if (count > 0) {
    throw {status: 400, message: 'Email already exists.'};
  }
  data.passwordSalt = generateSalt(8);
  data.passwordHash = hashWithSalt(data.password, data.passwordSalt);
  data.apiKey = uuid.v4();
  let user = new models.User(data);
  await user.save();
  req.session.user = _.omit(user.toObject(), ['passwordHash', 'passwordSalt']);
  res.json({success: true});
});

router.post('/login', async (req, res) => {
  let data = req.body;
  if (!data.email || !data.password) {
    throw {status: 400};
  }
  let user = await models.User.findOne({email: data.email}).exec();
  if (!user) {
    throw {status: 404, message: 'Email not existed.'};
  }
  let passwordHash = hashWithSalt(data.password, user.passwordSalt);
  if (passwordHash !== user.passwordHash) {
    throw {status: 401, message: 'Invalid password.'};
  }
  req.session.user = _.omit(user.toObject(), ['passwordHash', 'passwordSalt']);
  res.json({success: true});
});

router.post('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.json({success: true});
  });
});

function hashWithSalt(content, salt, algorithm) {
  let c = crypto.createHmac(algorithm || 'sha256', salt);
  c.update(content, 'utf8');
  return c.digest('hex');
}

function generateSalt(length) {
  return crypto.randomBytes(length || 128).toString('base64');
}

function checkUserForWeb(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

function checkUserForApi(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({message: 'Not authenticated.'});
  }
  next();
}

_.extend(module.exports, {router, checkUserForWeb, checkUserForApi});
