module.exports = function ServerAuth(config, app) {
    var models = require('../models')
    , User = new models.User(config);
    var AppError = require('../util/server-error.js');
    var passport = require('passport')
    , util = require('util')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    
    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Google profile is
    //   serialized and deserialized.
    passport.serializeUser(function (sessionUser, done) {
        //
        // serialize only the user id
        done(null, sessionUser.Id);
    });
    
    passport.deserializeUser(function (id, done) {
        // only the id was serialized. so look up the user record so that it is set in session
        User.getUserById(id, function (err, user) {
            if (err) return done(err, null);
            done(null, mapUserToSessionUser(user));
        })
    });
    
    function mapUserToSessionUser(user) {
        return {
            Id: user._id, 
            name: user.lastName + ', ' + user.firstName, 
            email: user.email, 
            token: user.accessToken
        }
    }
    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passport.use(new GoogleStrategy({
        clientID: config.auth.google.oauth2.GOOGLE_CLIENT_ID,
        clientSecret: config.auth.google.oauth2.GOOGLE_CLIENT_SECRET,
        callbackURL: config.auth.google.oauth2.OAUTH2_CALL_BACK_URL,
        passReqToCallback: true
    },
        function (req, accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            console.log(profile);
            
            // Check if the user has to be saved
            // Is the user already in database
            User.getUserByProfileId(profile.id, function (err, user) {
                if (err) {
                    console.log(err);
                    req.session.error = new AppError(
                         "App Error", 
                         "Data retrieval failed" , 
                         500
                    );
                    return done(req.session.error);
                }
                console.log(user);
                if (!user) {
                    console.log('********************** user not found *******************');
                    // User is not found in database
                    // is the user trying to sing up?
                    if (req.session.signup) {
                        // If yes,
                        // Has it exceeded sign up count?
                        User.totalUserCount(function (err, count) {
                            if (err) {
                                console.log(err);
                                req.session.error = new AppError(
                                     "App Error", 
                                     "Data retrieval failed" , 
                                     500
                                );
                                done(req.session.error);
                            }
                            
                            if (config.signup.canUserSignUp(count)) {
                                // If not exceeded, 
                                // Save user                                
                                User.createUser({
                                    email: profile.emails[0].value,
                                    firstName: profile.name.givenName,
                                    lastName: profile.name.familyName,
                                    profileId: profile.id,
                                    accessToken: accessToken
                                }, function (err, user) {
                                    if (err) {
                                        console.log(err);
                                        req.session.error = new AppError(
                                             "App Error", 
                                             "User save failed" , 
                                             500
                                        );
                                        done(req.session.error);
                                    }
                                    // user created. continue
                                    return done(null, mapUserToSessionUser(user));
                                });
                            } else {
                                // If exceeded,
                                // reject
                                req.session.error = new AppError(
                                     'Sign Up Error', 
                                     'Max user sign up exceeded', 
                                     401
                                );
                                return done(req.session.error);
                            }
                        })
                    } else {
                        // reject login
                        req.session.error = new AppError(
                             'Login Error', 
                             'Unauthorized user. Login rejected', 
                             401
                        );
                        return done(req.session.error);
                    }
                } else {
                    console.log('********************** user is found *******************' + user.lastName + ', ' + user.firstName);
                    return done(null, mapUserToSessionUser(user));
                }

            })
        //return done(null, profile);
        });
    }
    ));
    
    //****** app Routes **********//
    var api = {
        authGoogleApi: function () {
            // GET /auth/google
            //   Use passport.authenticate() as route middleware to authenticate the
            //   request.  The first step in Google authentication will involve
            //   redirecting the user to google.com.  After authorization, Google
            //   will redirect the user back to this application at /auth/google/callback
            app.get('/auth/google',
            passport.authenticate('google', {
                scope: config.auth.google.oauth2.scope
            }),
            function (req, res) {
                // The request will be redirected to Google for authentication, so this
                // function will not be called.
            });
        },
        
        authGoogleCallbackApi: function () {
            // GET /auth/google/callback
            //   Use passport.authenticate() as route middleware to authenticate the
            //   request.  If authentication fails, the user will be redirected back to the
            //   login page.  Otherwise, the primary route function function will be called,
            //   which, in this example, will redirect the user to the home page.
            app.get('/auth/google/callback', 
            passport.authenticate('google', { failureRedirect: '/login' }), 
            function (req, res) {
                res.redirect('/');
            });
        },
        
        loggedInUserApi: function () {
            app.get('/api/loggedInUser', config.auth.ensureApiAuthenticated, function (req, res) {
                console.log('******** Logged In User ******** ' + req.user.name);
                res.status(200).json({ name: req.user.name, email: req.user.email });
            })
        },
        
        logoutApi: function () {
            app.post('/api/logout', function (req, res) {
                req.logout();
                req.session.destroy();
                res.sendStatus(200).end();
            });
        },
        
        signUpApi: function () {
            app.post('/api/signup', function (req, res, next) {
                var signUpCode = req.body.signUpCode;
                
                if (config.signup.isValidSignUpCode(signUpCode)) {
                    req.session.signup = true;
                    res.sendStatus(200).end();
                }
                else {
                    req.session.error = new AppError(
                         'Sign Up Error', 
                         'Invalid sign up code. Please provide a valid sign up code', 
                         401
                    );
                    res.status(401).json(req.session.error);
                }
            });
        }
    };
    
    function init() {
        // Initialize Passport!  Also use passport.session() middleware, to support
        // persistent login sessions (recommended).
        app.use(passport.initialize());
        app.use(passport.session());
        
        config.api.registerRoutes(api);
    }
    
    init();

}