angular.module('myApp', ['app.config', 'ngRoute', 'app.homePages'])

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/', {
      controller: 'HomeCtrl',
      templateUrl: TPL_PATH + '/home.html'
    });
  });
