angular.module('app.homePages', ['app.config', 'app.services', 'ngResource', 'ngAnimate', 'angularSpinkit']).

  controller('HomeCtrl', function($scope, $window, files) {
    $scope.files = [];
    $scope.loading = true;
    
    $scope.urlFor = function(file) {
      if (!file || $window._.isUndefined(file.key)) {
        return;
      }

      return '/#/file/' + encodeURIComponent(file.key);
    };

    $scope.delete = function(file) {
      var index;
      if ($window.confirm("Are you sure you want to delete " + file.name)) {
        index = $scope.files.indexOf(file);
        file.$delete().then(function(){
          $scope.files.splice(index, index+1);
        });
      }

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
