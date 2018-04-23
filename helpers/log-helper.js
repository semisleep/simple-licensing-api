'use strict';

const path = require('path');
const fs = require ('fs');
const winston = require ('winston');

let logger;
exports.log = function () {
  logger.info.apply(logger, arguments);
};
exports.debug = function () {
  logger.debug.apply(logger, arguments);
};
exports.info = function () {
  logger.info.apply(logger, arguments);
};
exports.warn = function () {
  logger.warn.apply(logger, arguments);
};
exports.error = function () {
  logger.error.apply(logger, arguments);
};

exports.getLogger = function (prefix) {
  return {
    disabled: false,
    log: function () {
      if (this.disabled) {
        return;
      }
      logger.info.apply(logger, addPrefix(arguments));
    },
    debug: function () {
      if (this.disabled) {
        return;
      }
      logger.debug.apply(logger, addPrefix(arguments));
    },
    info: function () {
      if (this.disabled) {
        return;
      }
      logger.info.apply(logger, addPrefix(arguments));
    },
    warn: function () {
      if (this.disabled) {
        return;
      }
      logger.warn.apply(logger, addPrefix(arguments));
    },
    error: function () {
      if (this.disabled) {
        return;
      }
      logger.error.apply(logger, addPrefix(arguments));
    }
  };
  function addPrefix(args) {
    let first = args[0];
    if (first) {
      return [prefix + first].concat(Array.prototype.slice.call(args, 1));
    } else {
      return args;
    }
  }
};

(() => {
  let logDir = path.join(__dirname, '../log');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  let appLogFile = logDir + '/app.log';
  let errorLogFile = logDir + '/error.log';
  let fileSize = 1024 * 1024 * 10;
  let maxFiles = 50;
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({level: 'debug', handleExceptions: true, debugStdout: true}),
      new (winston.transports.File)({
        level: 'debug',
        name: 'file.app',
        filename: appLogFile,
        maxsize: fileSize,
        maxFiles: maxFiles,
        handleExceptions: true,
        json: false
      }),
      new (winston.transports.File)({
        level: 'error',
        name: 'file.error',
        filename: errorLogFile,
        maxsize: fileSize,
        maxFiles: maxFiles,
        handleExceptions: true,
        json: false
      })
    ]
  });
})();
