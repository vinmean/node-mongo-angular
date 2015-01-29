angular.module('EmpApp')
  .controller('NavbarCtrl', ['$scope', '$location', '$alert', 'AuthService', 'Employee', function ($scope, $location, $alert, AuthService, Employee) {
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
        $scope.searchModel = {
            searchLabel: 'Search by Last Name',
            searchType: 1,
            searchText: '',
            searchOpts: [
                {
                    title: 'Search By Last Name', 
                    type: 1, 
                    label: 'By Last Name'
                },
                {
                    title: 'Search By Skills', 
                    type: 2, 
                    label: 'By Skills'
                },
            ]
        };

        $scope.search = function () {
            console.log('search text = ' + $scope.searchModel.searchText);
            $location
            .path('/')
            .search('searchText', $scope.searchModel.searchText)
            .search('searchType', $scope.searchModel.searchType)
            .search('searchLabel', $scope.searchModel.searchLabel);
        };
        $scope.changeSearch = function (label, code){
            console.log('label = ' + label);
            console.log('code = ' + code);
            $scope.searchModel.searchLabel = label;
            $scope.searchModel.searchType = code;
        }
  }]);