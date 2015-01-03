angular.module('EmpApp')
  .controller('NavbarCtrl', ['$scope', '$location', '$alert', 'AuthService', function ($scope, $location, $alert, AuthService) {
      $scope.logout = function () {
            AuthService.logout(function onSuccess() {
                $alert({
                    content: 'You have been logged out.',
                    placement: 'top-right',
                    type: 'info',
                    duration: 3
                });
                $location.path('/login');
            });
      };
  }]);