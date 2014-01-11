angular.module('myApp', ['app.config', 'ngRoute', 'app.homePages', 'app.filePages'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.
      when('/', {
        controller: 'HomeCtrl',
        templateUrl: TPL_PATH + '/home.html'
      }).

      when('/upload', {
        controller: 'UploadCtrl',
        templateUrl: TPL_PATH + '/upload.html'
      }).

      when('/file/:key', {
        controller: 'EditCtrl',
        templateUrl: TPL_PATH + '/edit.html'
      });
  });
