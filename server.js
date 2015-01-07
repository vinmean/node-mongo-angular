// read environment variables
var env = require('node-env-file');
env(__dirname + '/process.env');

// get all the required modules
var express = require('express');
var express_session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Configuration
var config = require('./lib/server-config.js');
var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//http://stackoverflow.com/questions/19917401/node-js-express-request-entity-too-large
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express_session({
    secret: '8d02bcc5e844a073f04d84119c96254a',
    resave: false,
    saveUninitialized: true
}));

config.registerApi(app);

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname + "/public" });
});

function errorHandler(err, req, res, next) {
    console.log(err);
    res.status(401);
    res.sendFile('index.html', { root: __dirname + "/public" });
}

app.use(errorHandler);

app.set('port',config.server.port);

app.listen(config.server.port, config.server.ip, function () {
    console.log('Express server listening on ' + config.server.ip + ' port ' + app.get('port'));
});
