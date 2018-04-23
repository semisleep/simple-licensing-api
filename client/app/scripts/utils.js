'use strict';

import _ from 'lodash';

function getDomain() {
  let hostname = window.location.hostname;
  let lastDotIndex = hostname.lastIndexOf('.');
  if (lastDotIndex < 0 || !_.isNaN(parseInt(hostname.substring(lastDotIndex + 1)))) {
    return;
  }
  return hostname.substring(hostname.lastIndexOf('.', lastDotIndex - 1) + 1);
}

function fullClone(object) {
  if (_.isUndefined(object) || _.isNull(object) || _.isNaN(object)) {
    return object;
  }
  return JSON.parse(JSON.stringify(object));
}

function isMobile() {
  return window.innerWidth < 768;
}

function isDesktop() {
  return window.innerWidth >= 768;
}

function isWechat() {
  return window.navigator.userAgent && window.navigator.userAgent.match(/MicroMessenger/i);
}

export default {
  getDomain,
  fullClone,
  isMobile,
  isDesktop,
  isWechat
};

