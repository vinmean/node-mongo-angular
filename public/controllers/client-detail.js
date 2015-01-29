angular.module('EmpApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$alert', '$location', 'Employee',
    function ($scope, $rootScope, $routeParams, $timeout, $alert, $location, Employee) {
        $scope.hidePhoto = true;
        $scope.employee = Employee.get({ _id: $routeParams.id }, function (employee) {
            if ($scope.employee.photoSrc !== '') {
                $scope.hidePhoto = false;
            }
        });
        $scope.upload = function (photo) {
            if (photo) {
                console.log("upload file");
                var fileReader = new FileReader();
                fileReader.readAsDataURL(photo[0]);
                fileReader.onloadend = function () {
                    console.log("upload file ended");
                    $scope.$apply(function () {
                        $scope.employee.photoSrc = fileReader.result;
                        $scope.hidePhoto = false;
                    });
                }
            }
        };
        $scope.saveEmployee = function () {
            console.log('saving...');
            $scope.employee.$save(
            function () {
                $scope.saveForm.$setPristine();
                $alert({
                    title: 'Employee Update',
                    content: 'Employee data has been updated.',
                    placement: 'top-right',
                    type: 'success',
                    duration: 3
                });
                $location.path('/');
            },
            function (err) {
                console.log(err);
                $scope.saveForm.$setPristine();
                $alert({
                    title: err.data.title,
                    content: err.data.message,
                    placement: 'top-right',
                    type: 'danger',
                    duration: 3
                });
            });
        };
    }]);