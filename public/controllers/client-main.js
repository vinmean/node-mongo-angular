angular.module('EmpApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'Employee', function ($scope, $routeParams, Employee) {
        //$scope.headingTitle = ($routeParams.searchText)? $routeParams.searchLabel + ' for ' + $routeParams.searchText: 'First Ten Employees...';
        //$scope.slideInterval = 3000;
        //$scope.employees = Employee.query({
        //    searchText: $routeParams.searchText, 
        //    searchType: $routeParams.searchType
        //});
        
        $scope.mainModel = {
            headingTitle: ($routeParams.searchText)? 
                            $routeParams.searchLabel + ' for ' + $routeParams.searchText: 
                            'First Ten Employees...',
            slideInterval: 3000,
            employees: Employee.query({
                searchText: $routeParams.searchText, 
                searchType: $routeParams.searchType
            })
        }
    }]);