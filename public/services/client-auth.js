angular.module('EmpApp')
  .factory('AuthService', ['$http', '$rootScope',
    function ($http, $rootScope ) {
        $rootScope.currentUser = null;

        return {
            loggedInUser: function (onError) {
                return $http.get('/api/loggedInUser')
                  .success(function (data) {
                    $rootScope.currentUser = data;
                  })
                  .error(function (err) {
                    onError(err);
                  });
            },
            signup: function (signUpData, onSuccess, onError) {
                return $http.post('/api/signup', signUpData)
                  .success(function () {
                    onSuccess();
                  })
                  .error(function (err) {
                    onError(err);
                  });
            },
            logout: function (onSuccess) {
                return $http.post('/api/logout', {}).success(function () {
                    $rootScope.currentUser = null;
                    onSuccess();
                });
            }
        };
    }]);