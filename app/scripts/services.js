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
      },
      info: function(key) {
        return res.get({key: key}).$promise;
      },
      updateInfo: function(info) {
        return res.save({key: info.key}, info).$promise;
      }
    };
  })

;