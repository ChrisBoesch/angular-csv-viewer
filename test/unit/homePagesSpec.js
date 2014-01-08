/*global describe, beforeEach, it, inject, expect*/

describe('Home Pages', function() {

  var ctrl, scope;

  beforeEach(module('app.homePages'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('HomeCtrl', {
      $scope: scope
    });
  }));

  describe('Home Controller', function() {

    describe('Initialization', function() {

      it('should instantiate videos to null', function() {
        expect(scope.videos).toBeNull();
      });

    });

  });
});
