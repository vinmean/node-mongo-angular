exports.registerRoutes= function registerRoutes(api, app) {
    for (var prop in api) {
        if (prop.lastIndexOf('Api') == (prop.length - 3)) {
            api[prop](app);
        }
    }
};