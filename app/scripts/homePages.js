angular.module('app.homePages', ['app.config', 'ngResource', 'ngAnimate', 'angularSpinkit'])

  .factory('videos', function(API_BASE, $resource) {
    var res = $resource(API_BASE + '/videos');
    return {
      all: function() {
        return res.query().$promise;
      }
    };
  })

  .controller('HomeCtrl', function($scope, videos) {
    $scope.videos = null;
    videos.all().then(function(data) {
      $scope.videos = data;
    });

  });
