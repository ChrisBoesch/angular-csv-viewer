angular.module('app.services', ['app.config']).

  factory('files', function(API_BASE, $resource){
    var res = $resource(API_BASE + '/file/:key');
    console.dir(res);
    return {
      all: function() {
        return res.query().$promise;
      },
    };
  })

;