angular.module('app.homePages', ['app.config', 'app.services', 'ngResource', 'ngAnimate', 'angularSpinkit']).

  controller('HomeCtrl', function() {}).

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
