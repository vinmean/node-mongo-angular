// read environment variables
var env = require('node-env-file');
env(__dirname + '/process.env');

// get all the required modules
var express = require('express');
var express_session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
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
app.use(config.logger());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(config.session);

config.reverseProxy(app);

// CSRF protection
var csrf = require('csurf');
app.use(csrf())
.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    next();
})

//redirect to https if https is to be used
function redirectToHttps(req, res, next){
    if (config.useHttps) {
        if (!req.secure){
            var url = 'https://' + req.headers.host + req.path;
            console.log('redirect url = ' + url);
            return res.redirect(url);
        } 
    }
    next();
}
app.use(redirectToHttps);

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    
    console.log(req.headers);

    // handle CSRF token errors here
    req.session.error = {
        title: 'CSRF Violation', 
        message: 'Session has expired or request tampered with', 
        code: 403
    };

    if (req.xhr) {
        res.status(403).json(req.session.error);
    }
    else {
        next(err);
    }
})

config.api.registerApi(app);

app.get('/', function (req, res) {
    if (config.useHttps) {
        if (!req.secure){
            var url = 'https://' + req.headers.host + req.path;
            console.log('default redirect url = ' + url);
            return res.redirect(url);
        } 
    }
    res.sendFile('index.html', { root: __dirname + "/public" });
});

function errorHandler(err, req, res, next) {
    console.log(err);
    if (config.useHttps) {
        if (!req.secure){
            var url = 'https://' + req.headers.host;
            console.log('default error redirect url = ' + url);
            return res.redirect(url);
        } 
    }
    return res.redirect('http://' + req.headers.host);
}

app.use(errorHandler);

app.set('port',config.server.port);

app.listen(config.server.port, config.server.ip, function () {
    console.log('Express server listening on ' + config.server.ip + ' port ' + app.get('port'));
});
