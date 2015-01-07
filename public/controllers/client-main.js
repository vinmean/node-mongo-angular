angular.module('EmpApp')
  .controller('MainCtrl', ['$scope', 'Employee', function ($scope, Employee) {
        $scope.headingTitle = 'First Ten Employees...';
        $scope.employees = Employee.query();

  }]);