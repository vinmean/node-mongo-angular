var app = angular.module('EmpApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap', 'angularFileUpload', 'ui.bootstrap']); 

var loginRequired = ['$alert','AuthService', function ($alert, AuthService) {
        return AuthService.loggedInUser(function onError(err) {
            console.log(err);
            if (err && err.title) {
                $alert({
                    title: err.title,
                    content: err.message,
                    placement: 'top-right',
                    type: 'danger',
                    duration: 3
                });
            } else {
                $alert({
                    title: 'Unknown Error',
                    content: 'Unexpected error occuured',
                    placement: 'top-right',
                    type: 'danger',
                    duration: 3
                });
            }
        });
    }]

app.run(['$rootScope', '$location', function ($rootScope, $location) {
        
        $rootScope.$on('$routeChangeSuccess', function (userInfo) {
            console.log(userInfo);
        });
        
        $rootScope.$on('$routeChangeError', function (event, current, previous, eventObj) {
            console.log('route change error triggered');
            console.log(eventObj);

            if (eventObj.status === 401) {
                console.log('Unauthorized. Redirect to login');
                $location.path('/login');
            }
            else {
                console.log('Unknown error');
                $location.path('/login');
            }
        });
    }]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
          .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainCtrl',
            resolve:{activeLogin: loginRequired}
        })
          .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
          .when('/add', {
            templateUrl: 'views/add.html',
            controller: 'AddCtrl',
            resolve: { activeLogin: loginRequired }
        })
          .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })
          .when('/employees/:id', {
            templateUrl: 'views/detail.html',
            controller: 'DetailCtrl',
            resolve: { activeLogin: loginRequired }
        })
        //  .when('/auth/google', {
        //    redirectTo: '/auth/google'
        //})
          .otherwise({
            redirectTo: '/'
        });

    }]);