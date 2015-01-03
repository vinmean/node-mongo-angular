angular.module('EmpApp')
  .controller('SignupCtrl', ['$scope', '$location', '$alert', 'AuthService', function ($scope, $location, $alert, AuthService) {
        $scope.signup = function () {
            AuthService.signup({
                signUpCode: $scope.signUpCode
            }, 
                function onSuccess() {
                $location.path('/login');
                
                $alert({
                    title: 'Congratulations!',
                    content: 'Your can now login to complete the sign up',
                    placement: 'top-right',
                    type: 'success',
                    duration: 3
                });
            },
            function onError(err) {
                console.log(err);
                $alert({
                    title: err.title,
                    content: err.message,
                    placement: 'top-right',
                    type: 'danger',
                    duration: 3
                });
            });
        };
    }]);