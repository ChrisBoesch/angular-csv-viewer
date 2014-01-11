angular.module('app.homePages', ['app.config', 'app.services', 'ngResource', 'ngAnimate', 'angularSpinkit']).

  controller('HomeCtrl', function($scope, files) {
    $scope.files = [];
    $scope.loading = true;
    
    $scope.urlFor = function(file) {
      return '/#/file/' + encodeURIComponent(file.key);
    };
    
    files.all().then(function(data) {
      $scope.loading = false;
      $scope.files = data;
    });
  }).

  controller('MenuCtrl', function($scope, $route) {
    $scope.isActive = function(ctrlName) {
      if (!$route.current ||
        !$route.current.$$route ||
        !$route.current.$$route.controller
      ) {
        return false;
      }
      return $route.current.$$route.controller === ctrlName;
    };
  }).

  controller('LogonCtrl', function($scope){
    // TODO: fetch the user logoff URL.
    
    $scope.logoffUrl = function () {
      return '#';
    };
  });
