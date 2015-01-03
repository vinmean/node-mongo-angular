angular.module('EmpApp')
  .controller('LoginCtrl', ['$scope', 'AuthService', function ($scope, AuthService) {
      $scope.login = function () {
            AuthService.login({
              email: $scope.email,
              password: $scope.password
          });
      };
  }]);