/*global describe, beforeEach, it, inject, expect*/

describe('Home Pages', function() {

  var ctrl, scope, route;

  beforeEach(module('app.homePages'));

  describe('Home Menu', function(){
    var files, allDefer;

    beforeEach(inject(function($controller, $rootScope, $q) {
      scope = $rootScope.$new();
      allDefer = $q.defer();

      files = {'all': function(){
          return allDefer.promise;
        }
      };

      ctrl = $controller('HomeCtrl', {
        $scope: scope,
        files: files
      });
    }));

    describe('Initialization', function(){
      it('should set the list of the current user list of file', function() {
        expect(scope.files).toEqual([]);
        expect(scope.loading).toBe(true);
      });
    });

    describe('files scope attribute', function(){

      it('should update when files.all() promise is resolved', function(){
        var data = [
          {
            'name': 'foo',
            'lastUpdate': 1234567890,
            'key': 'foo'
          }
        ];

        allDefer.resolve(data);
        scope.$apply();
        expect(scope.files).toEqual(data);
      });

    });

  });

  describe('Menu Controller', function() {

    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      route = {};
      ctrl = $controller('MenuCtrl', {
        $scope: scope,
        $route: route,
      });
    }));

    describe('isActive method', function() {

      it('Should return false when route is not set', function() {
        expect(scope.isActive('foo')).toBe(false);
      });

      it('Should return false when the current conroller name does not match', function() {
        route.current = {'$$route': {'controller': 'bar'}};
        expect(scope.isActive('foo')).toBe(false);
      });

      it('Should return false when the current conroller name does match', function() {
        route.current = {'$$route': {'controller': 'foo'}};
        expect(scope.isActive('foo')).toBe(true);
      });

    });

  });
});
