var Config = {
    server: {
        ip: process.env.OPENSHIFT_NODEJS_IP || process.env.SERVER_IP || 'localhost',
        port: process.env.OPENSHIFT_NODEJS_PORT || process.env.SERVER_PORT || 3000
    },
    logger: function () {
        var logger = require('morgan');
        if (process.env.OPENSHIFT_LOG_DIR) {
            var fs = require('fs');
            var appLogStream = fs.createWriteStream(process.env.OPENSHIFT_LOG_DIR + '/app.log', { flags: 'a' });
            return logger('combined', { stream: appLogStream });
        } else {
            return logger('dev');
        }
    },
    lodash: require('lodash'),
    mongodb: {
        mongoose: require('mongoose'),
        connect: {
            options: {
                server: {
                    socketOptions: { keepAlive: 1 }
                }
            },
            connectionString: process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGODB_DB_URL || 'localhost'
        }
    },
    auth: {
        google: {
            oauth2: {
                // API Access link for creating client ID and secret:
                // https://code.google.com/apis/console/
                GOOGLE_CLIENT_ID: process.env.OPENSHIFT_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '395939972047-h1r31sipcd2cat7act2ocv3r5pg0hq7e.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: process.env.OPENSHIFT_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '8Bu7u_rnYqUiNzUkj9Ym0RYK',
                OAUTH2_CALL_BACK_URL: process.env.OPENSHIFT_OAUTH2_CALL_BACK_URL || process.env.OAUTH2_CALL_BACK_URL || 'http://localhost:3000/auth/google/callback'
            }
        },
        // Simple route middleware to ensure user is authenticated.
        //   Use this route middleware on any resource that needs to be protected.  If
        //   the request is authenticated (typically via a persistent login session),
        //   the request will proceed.  Otherwise, the user will be redirected to the
        //   login page.
        ensureAuthenticated: function (req, res, next) {
            if (req.isAuthenticated()) {
                req.session.error = null;
                return next();
            }
            res.redirect('/login');
        },
        
        ensureApiAuthenticated: function (req, res, next) {
            if (req.isAuthenticated()) {
                req.session.error = null;
                return next();
            }
            else {
                var err = (req.session.error)? req.session.error: {
                    title: 'Login Error', 
                    message: 'A valid login session is required', 
                    code: 401
                };
                req.session.error = err;
                res.status(err.code).json(err);
            }
        },
    },
    signup: {
        validCodes: [12345678922, 13345678922, 12445678922, 14545678922, 12345123422, 12322134522],
        allowedUserCount: 10
    }
};
//Dynamic ones which need to refer to Config
//=============== Mongo DB =================
Config.mongodb.connect.connection = (function () {
    var singleton = (function (config) {
        var conn;
        function createConn() {
            return config.mongodb.mongoose.createConnection(
                config.mongodb.connect.connectionString, 
                            config.mongodb.connect.options);
        }
        return {
            getConn: function () {
                if (!conn) {
                    conn = createConn();
                }
                return conn;
            }
        };

    })(Config);
    
    return singleton.getConn();
})();
//=============== Mongo DB =================

//================= API ====================
Config.api = {
    paths: ['auth', 'api']
};
Config.api.registerApi = function (app) {
    var fs = require('fs');
    Config.lodash(Config.api.paths).forEach(function (path) {
        fs.readdirSync(__dirname + '/' + path).forEach(function (file) {
            if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
                (require('./' + path + '/' + file))(Config, app);
            }
        });
    });
}
Config.api.registerRoutes = function (api, app) {
    for (var prop in api) {
        api[prop](app);
    }
};
//================= API ====================

//=============== Sign Up ==================
Config.signup.isValidSignUpCode = function (signUpCode) {
    if (Config.lodash.contains(Config.signup.validCodes, signUpCode)) {
        return true;
    }
    return false;
};
Config.signup.canUserSignUp = function (userCount) {
    if (userCount < Config.signup.allowedUserCount) {
        return true;
    }
    return false;
}
//=============== Sign Up ==================

//=============== Session ==================
Config.session = (function () {
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);
    
    return session({
        secret: '8d02bcc5e844a073f04d84119c96254a',
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: Config.mongodb.connect.connection
        })
    });
})();
//=============== Session ==================
module.exports = Config;