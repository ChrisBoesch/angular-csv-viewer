angular.module('app.services', ['app.config']).

  factory('files', function(API_BASE, $resource, $http){
    var res = $resource(API_BASE + '/file/:key');
    return {
      all: function() {
        return res.query().$promise;
      },
      download: function(key) {
        return $http.get(
          API_BASE + '/file/' + encodeURIComponent(key) + '.csv'
        );
      }
    };
  })

;