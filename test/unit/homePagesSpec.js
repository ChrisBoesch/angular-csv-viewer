/*global describe, beforeEach, it, inject, expect*/

describe('Home Pages', function() {

  var ctrl, scope, route, win={};

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
        files: files,
        $window: win
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

    describe('scope delete method ', function(){
      beforeEach(function(){
        win.confirm = function() {
          return true;
        };
      });

      it('should called the file resource $delete method', inject(function($q) {
        var called=false, mockFile = {
          $delete: function(){
            var d = $q.defer();
            called = true;
            d.resolve({});
            return d.promise;
          }
        };

        scope.delete(mockFile);
        expect(called).toBe(true);
      }));

      it('should remove the file for the files list', inject(function($q) {
        var mockFile = {
          $delete: function(){
            var d = $q.defer();
            d.resolve({});
            return d.promise;
          }
        };
        scope.files = [mockFile];
        scope.delete(mockFile);

        scope.$apply();
        expect(scope.files).toEqual([]);
      }));
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
