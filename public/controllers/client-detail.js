angular.module('EmpApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Employee',
    function ($scope, $rootScope, $routeParams, Employee) {
        Employee.get({ _id: $routeParams.id }, function (employee) {
            $scope.employee = employee;

        });
    }]);