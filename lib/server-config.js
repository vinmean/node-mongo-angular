module.exports = {
    mongodb: {
        connectionString: process.env.MONGO || 'localhost',
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
            GOOGLE_CLIENT_ID: '395939972047-h1r31sipcd2cat7act2ocv3r5pg0hq7e.apps.googleusercontent.com',
            GOOGLE_CLIENT_SECRET: '8Bu7u_rnYqUiNzUkj9Ym0RYK',
            OAUTH2_CALL_BACK_URL: process.env.OAUTH2_CALL_BACK_URL || 'http://localhost:3000/auth/google/callback'
        }
    }
};