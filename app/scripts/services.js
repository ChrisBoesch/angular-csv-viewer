angular.module('app.services', ['app.config'])
  
  .factory('videos', function(API_BASE, $resource) {
    var res = $resource(API_BASE + '/videos');
    return {
      all: function() {
        return res.query().$promise;
      }
    };
  })

;