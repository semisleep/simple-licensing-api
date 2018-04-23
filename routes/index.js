'use strict';

const _ = require('lodash');
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('node-uuid');
const {checkUserForWeb, checkUserForApi} = require('./api/auth');
const models = require('../models');
const logHeler = require('../helpers/log-helper');
const excelHelper = require('../helpers/excel-helper');

let router = express.Router();

router.use('/api/auth', require('./api/auth').router);
router.use('/api/check', require('./api/check').router);
router.use('/api/license', checkUserForApi, require('./api/license').router);

router.use((req, res, next) => {
  res.locals.session = req.session;
  _.extend(res.locals, require('../helpers/data-formatter.js'));
  next();
});

router.use((req, res, next) => {
  // redirect ie < 10
  let ua = (req.headers['user-agent'] || '').toLowerCase();
  let ie = (ua.indexOf('msie') !== -1) ? parseInt(ua.split('msie')[1]) : false;
  if (ie && ie < 10) {
    res.send('IE not supported, find yourself a modern browser folk!');
    return;
  }
  next();
});

router.get('/', (req, res) => {
  res.render('vue', {entry: 'landing'});
});

router.get(['/app', '/app/*'], checkUserForWeb, (req, res) => {
  res.render('vue', {entry: 'app', data: {user: req.session.user}});
});

router.get('/export', checkUserForWeb, async (req, res) => {
  try {
    let items = await models.License.find({_owner: req.session.user._id}).exec();
    let data = [];
    data.push(['Key', 'Max Usage', 'Current Usage', 'Created At', 'Last Validated At', 'Devices']);
    for (let item of items) {
      data.push([item.key, item.maxUsage, item.currentUsage, item.createdAt, item.lastValidatedAt,
        item.devices.map(device => device.identifier + ' ' + device.extra).join('\n')]);
    }
    let generatedFileName = uuid.v4() + '.xlsx';
    let dir = path.join(__dirname, '..', 'upload');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    let fullPath = path.join(dir, generatedFileName);
    excelHelper.toExcel([{name: 'Licenses', data}], fullPath);
    res.download(fullPath, 'licenses.xlsx', (e) => {
      if (e) {
        logHeler.error('Fail to download file', e);
      }
      fs.unlinkSync(fullPath);
    });
  } catch (e) {
    logHeler.error('Fail to export', e);
  }
});

module.exports = router;
