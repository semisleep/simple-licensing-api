'use strict';

function exclude(ignorePaths, middleware) {
  return function (req, res, next) {
    let found = false;
    for (let i = 0; i < ignorePaths.length; i++) {
      let path = ignorePaths[i];
      if (req.path.indexOf(path) === 0) {
        found = true;
        break;
      }
    }

    if (found) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}

module.exports = exclude;
