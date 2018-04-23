'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require ('crypto');
const config = require('../config');

function setUp(app) {
  app.locals.scriptTag = scriptTag;
  app.locals.cssTag = cssTag;
}

let resourceUrlCache = {};

function getDistUrl(rawUrl) {
  let url;
  if (rawUrl.indexOf('http://') < 0 && rawUrl.indexOf('https://') < 0 && rawUrl.charAt(0) !== '/') { // relative url
    if (resourceUrlCache[rawUrl]) {
      url = resourceUrlCache[rawUrl];
    } else if (config.production) {
      let urlLocation = path.join(__dirname, '..', '/client/dist/' + rawUrl);
      let content = fs.readFileSync(urlLocation, {encoding: 'utf-8'});
      url = '/dist/' + rawUrl;
      let h = hash(content);
      url = url + '?h=' + h;
      resourceUrlCache[rawUrl] = url;
    } else {
      url = '/dist/' + rawUrl;
    }
  } else {
    url = rawUrl;
  }
  return url;
}

function hash(content, algorithm) {
  let c = crypto.createHash(algorithm || 'sha256');
  c.update(content, 'utf8');
  return c.digest('hex');
}

function scriptTag(rawUrl) {
  return '<script type="text/javascript" src="' + getDistUrl(rawUrl) + '"></script>';
}

function cssTag(rawUrl) {
  return '<link href="' + getDistUrl(rawUrl) + '" rel="stylesheet" />';
}

module.exports = {
  setUp: setUp
};