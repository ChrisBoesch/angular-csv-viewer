/*global describe, beforeEach, it, inject, expect*/

describe('Home Pages', function() {

  var ctrl, scope, route;

  beforeEach(module('app.homePages'));

  describe('Home Menu', function(){
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('HomeCtrl', {
        $scope: scope,
      });
    }));

    describe('Initialization', function(){
      it('should set the list of the current user list of file', function() {
        expect(scope.files).toEqual([]);
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
