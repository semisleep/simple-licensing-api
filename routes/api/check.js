'use strict';

const _ = require('lodash');
const express = require('express');
const routeHelper = require('../../helpers/route-helper');
const models = require('../../models');

let router = routeHelper.wrapJsonError(express.Router());

router.get('/', async (req, res) => {
  let apiKey = req.query.key;
  let key = req.query.license;
  let identifier = req.query.device;
  let extra = req.query.extra || '';
  if (!key || !identifier) {
    throw {status: 400};
  }
  let user = await models.User.findOne({apiKey}).select().lean().exec();
  if (!user) {
    throw {status: 404, message: 'API key not found.'};
  }
  let license = await models.License.findOne({_owner: user._id, key}).exec();
  if (!license) {
    throw {status: 404, message: 'License not found.'};
  }
  let device = license.devices.find(device => device.identifier === identifier);
  if (device) {
    license.lastValidatedAt = new Date();
    await license.save();
    res.json({success: true});
  } else if (license.currentUsage < license.maxUsage) {
    license.devices.push({identifier, extra});
    license.currentUsage ++;
    await license.save();
    res.json({success: true});
  } else {
    throw {status: 403, message: 'No more activation quota for this license.'};
  }
});

_.extend(module.exports, {router});
