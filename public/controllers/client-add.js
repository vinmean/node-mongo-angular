angular.module('EmpApp')
  .controller('AddCtrl', ['$scope', '$location', '$alert', 'Employee', function ($scope, $location, $alert, Employee) {
        $scope.hidePhoto = true;
        $scope.addEmployee = function () {
            Employee.save({
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email,
                twitter: $scope.twitter,
                facebook: $scope.facebook,
                linkedIn: $scope.linkedIn,
                skills: $scope.skills,
                overview: $scope.overview,
                photoSrc: $scope.photoSrc
            },
            function () {
                $scope.addForm.$setPristine();
                $alert({
                    title: 'Employee Add',
                    content: 'Employee has been added.',
                    placement: 'top-right',
                    type: 'success',
                    duration: 3
                });
                $location.path('/');
            },
            function (err) {
                console.log(err);
                $scope.addForm.$setPristine();
                $alert({
                    title: err.data.title,
                    content: err.data.message,
                    placement: 'top-right',
                    type: 'danger',
                    duration: 3
                });
            });
        };
        $scope.upload = function (photo) {
            if (photo) {
                console.log("upload file");
                var fileReader = new FileReader();
                fileReader.readAsDataURL(photo[0]);
                fileReader.onloadend = function () {
                    console.log("upload file ended");
                    $scope.$apply(function () {
                        $scope.photoSrc = fileReader.result;
                        $scope.hidePhoto = false;
                    });
                }
            //fileReader.onload = function (e) {
            //    $upload.http({
            //        url: 'upload',
            //        headers: { 'Content-Type': file.type },
            //        data: e.target.result
            //    }).then(function (response) {
            ////success;
            //    }, null, function (evt) {
            //        $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
            //    });
            //}
            }
        };
  }]);