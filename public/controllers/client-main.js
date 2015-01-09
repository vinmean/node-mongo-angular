angular.module('EmpApp')
  .controller('MainCtrl', ['$scope', 'Employee', function ($scope, Employee) {
        $scope.headingTitle = 'First Ten Employees...';
        $scope.slideInterval = 3000;
        $scope.employees = Employee.query();

  }]);