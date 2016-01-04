/**
 * Created by urtzi on 08/12/2015.
 */
'use strict';

angular.module('myAppAngularMinApp')
  .controller('LoginCtrl', function ($scope, LoginService, $location, $localStorage) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.error = 0;

    $scope.goTo = function(url) {
      $location.path(url);
    };

    $scope.login = function(user) {
      $scope.message = '';
      $scope.error = 0;
      if (user.mail && user.password) {
        LoginService.login(user).then(function(res) {
          $scope.storage = $localStorage.$default({
            id:res.data.id,
	    username: res.data.username,
            token: res.data.token
          });
          $scope.goTo('/foro');
        }, function(res) {
          $scope.error = 1;
          $scope.message = res.data.message;

          //token de activacion al localstorage
          if($localStorage.ActivateToken !=null)
          {
            $localStorage.$reset();
          }
          $scope.storage = $localStorage.$default({
            ActivateToken: res.data.token
          });
        });
      }
    };

  });
