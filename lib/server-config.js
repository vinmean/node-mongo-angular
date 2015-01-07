module.exports = {
    server: {
        ip: process.env.OPENSHIFT_NODEJS_IP || process.env.SERVER_IP || 'localhost',
        port: process.env.OPENSHIFT_NODEJS_PORT || process.env.SERVER_PORT || 3000
    },
    mongodb: {
        connectionString: process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGODB_DB_URL || 'localhost',
    },
    mongoose: {
        opts: {
            server: {
                socketOptions: { keepAlive: 1 }
            }
        }
    },
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
    api_path: ['auth', 'api'],
    registerApi: function (app) {
        var config = this;
        var lodash = require('lodash');
        var fs = require('fs');
        lodash(config.api_path).forEach(function (path) {
            fs.readdirSync(__dirname + '/' + path).forEach(function (file) {
                if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
                    (require('./' + path + '/' + file))(config, app);
                }
            });
        });
        
    },
    registerRoutes: function (api, app) {
        for (var prop in api) {
            api[prop](app);
        }
    }
};