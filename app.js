'use strict';

const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const qs = require('qs');
const cors = require('cors');
const locale = require('locale');
const compression = require('compression');
const exclude = require('./routes/middlewares/exclude');
const viewHelper = require('./helpers/view-helper');
const logHelper = require('./helpers/log-helper');
const config = require('./config');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('query parser', s => {
  return qs.parse(s, {depth: 10, arrayLimit: 100});
});

viewHelper.setUp(app);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/client/static/images/favicon.ico'));
app.use(logger('dev'));
//let noBodyParser = ['/api'];
//app.use(exclude(noBodyParser, bodyParser.json()));
//app.use(exclude(noBodyParser, bodyParser.urlencoded({extended: false})));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser(config.sessionSecret));
let sessionOptions = {
  resave: false,
  saveUninitialized: false,
  secret: config.sessionSecret,
};
if (config.redis) {
  const RedisStore = require('connect-redis')(session);
  sessionOptions.store = new RedisStore(config.redis);
} else {
  const FileStore = require('session-file-store')(session);
  sessionOptions.store = new FileStore({
    ttl: 60 * 60 * 24
  });
}
app.use(session(sessionOptions));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(locale(['en', 'zh_CN', 'zh_TW', 'zh_HK']));

app.use('/dist', compression());
app.use('/dist', express.static(path.join(__dirname, 'client/dist'), {maxAge: config.web.resourceAge}));

app.use('/static', compression());
app.use('/static', express.static(path.join(__dirname, 'client/static'), {maxAge: config.web.resourceAge}));

// Enabling CORS
app.use(cors());
app.options('*', cors());

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use((req, res) => {
  logHelper.error('Cannot handle url: ' + req.url);
  res.status(404);
  res.render('vue', {entry: 'message', data: {message: 'Page not found'}});
});

// error handlers

// log errors
app.use((err, req, res, next) => {
  logHelper.error('Error handling request:', err.message ? err.message : err);
  if (err.stack) {
    logHelper.error(err.stack);
  }
  if (err.errors) {
    for (let error of err.errors) {
      logHelper.error('Error handling request:', error.message);
    }
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  let data = {
    message: err.message,
    error: config.production ? null : err
  };
  res.render('vue', {entry: 'message', data: data});
});

module.exports = app;
