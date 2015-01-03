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

// Models
var models = require('./lib/models')
, User = models.User(config);
console.log(User);

var ServerAuth = require('./lib/server-auth.js');
var _auth = new ServerAuth(User, config);
var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express_session({
    secret: '8d02bcc5e844a073f04d84119c96254a',
    resave: false,
    saveUninitialized: true
}));

// initialize authentication
_auth.init(app);

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname + "/public" });
});

// routes related to sign up and authentication
_auth.authGoogle(app);
_auth.authGoogleCallback(app);
_auth.loggedInUserApi(app);
_auth.logoutApi(app);
_auth.signUpApi(app);

function errorHandler(err, req, res, next) {
    console.log(err);
    res.status(401);
    res.sendFile('index.html', { root: __dirname + "/public" });
}

app.use(errorHandler);

app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
