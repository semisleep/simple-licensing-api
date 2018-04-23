'use strict';

// require libs for server codes
const moment = require('moment');

function empty(s) {
  return s || '-';
}

function formatFullDate(date) {
  return date ? moment(date).format('YYYY-MM-DD HH:mm') : '';
}

let formatter = {};

formatter.empty = empty;
formatter.formatFullDate = formatFullDate;

module.exports = formatter;