'use strict';

const _ = require('lodash');
const express = require('express');
const routeHelper = require('../../helpers/route-helper');
const models = require('../../models');

let router = routeHelper.wrapJsonError(express.Router());

router.post('/generate', async (req, res) => {
  let data = _.pick(req.body, ['licenseNum', 'maxUsage']);
  data.licenseNum = parseInt(data.licenseNum);
  data.maxUsage = parseInt(data.maxUsage);
  if (!data.licenseNum || !data.maxUsage) {
    throw {status: 400};
  }
  let existingKeys = await models.License.count({_owner: req.session.user._id}).exec();
  if (req.session.user.maxLicenseNum && existingKeys + data.licenseNum > req.session.user.maxLicenseNum) {
    throw {status: 400, message:`Your account cannot have more than ${req.session.user.maxLicenseNum} licenses, please send an email to jiezhou@magictek.cn to increase your quota.
    NOTE: the service is still free, we just need to ensure that our server have sufficient capacity for your app.`};
  }
  let keys = await generateUniqueProductKeys(req.session.user, data.licenseNum);
  for (let key of keys) {
    let item = new models.License({_owner: req.session.user._id, key, maxUsage: data.maxUsage});
    await item.save();
  }
  res.json({success: true});
});

router.get('/', async (req, res) => {
  let condition = {_owner: req.session.user._id};
  let pageSize = parseInt(req.query.pageSize) || 15;
  let page = parseInt(req.query.page) || 0;
  let totalItems = await models.License.count(condition).exec();
  let totalPages = Math.ceil(totalItems / pageSize);
  let sortBy = req.query.sortBy;
  let sortOrder = req.query.sortOrder;
  let query = models.License.find({_owner: req.session.user._id});
  if (sortBy) {
    let sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    query.sort(sort);
  }
  let items = await query.skip(pageSize * page).limit(pageSize).lean().exec();
  res.json({
    items,
    pagination: {page, totalPages, totalItems}
  });
});

router.put('/:id', async (req, res) => {
  let data = _.pick(req.body, ['maxUsage']);
  if (!data.maxUsage) {
    throw {status: 400};
  }
  let item = await models.License.findById(req.params.id).exec();
  if (!item) {
    throw {status: 404};
  }
  _.extend(item, data);
  await item.save();
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  let item = await models.License.findById(req.params.id).exec();
  if (!item) {
    throw {status: 404};
  }
  await item.remove();
  res.json({success: true});
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateUniqueProductKeys(user, count) {
  const bulkSize = 50;
  let keys = [];
  while (keys.length < count) {
    let bulkCount = Math.min(count - keys.length, bulkSize);
    let newKeys = generateProductKeys(bulkCount);
    let existingItems = await models.License.find({_owner: user._id, key: {$in: newKeys}}).select('key').lean().exec();
    newKeys = _.difference(newKeys, existingItems.map(item => item.key));
    keys = keys.concat(newKeys);
  }
  return keys;
}

function generateProductKeys(count) {
  let keys = [];
  while (keys.length < count) {
    let key = generateProductKey();
    if (keys.indexOf(key) < 0) {
      keys.push(key);
    }
  }
  return keys;
}

function generateProductKey() {
  let tokens = "ABCDEF0123456789",
    chars = 5,
    segments = 4,
    keyString = "";
  for (let i = 0; i < segments; i++) {
    let segment = "";
    for (let j = 0; j < chars; j++) {
      let k = getRandomInt(0, tokens.length - 1);
      segment += tokens[k];
    }
    keyString += segment;
    if (i < (segments - 1)) {
      keyString += "-";
    }
  }
  return keyString;
}

_.extend(module.exports, {router});
