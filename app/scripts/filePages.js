angular.module('app.filePages', ['app.config', 'app.services', 'ngResource', 'ngAnimate', 'angularSpinkit']).

  controller('UploadCtrl', function($scope, API_BASE) {
    // TODO: validate form and send it with ajax.
    $scope.action = API_BASE + '/file';
  }).

  controller('EditCtrl', function($scope, $routeParams) {
    // TODO: fetch file content.
    console.log($routeParams);
    $scope.name = decodeURIComponent($routeParams.fileName) || 'unknown';
  });
