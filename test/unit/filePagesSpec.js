/*global describe, beforeEach, it, inject, expect*/

describe('File Pages', function() {

  var ctrl, scope;

  beforeEach(module('app.filePages'));

  describe('Upload Controller', function() {
    var config;

    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      config = {'API_BASE': '/api/v1'};

      ctrl = $controller('UploadCtrl', {
        $scope: scope,
        API_BASE: config.API_BASE,
      });
    }));

    describe('Initialization', function() {

      it('Should set api upload url', function() {
        expect(scope.action).toBe('/api/v1/file');
      });

    });

  });

  describe('Edit Controller', function() {

    beforeEach(inject(function($rootScope) {
      scope = $rootScope.$new();
    }));

    describe('Initialization', function() {

      it('Should set file name', inject(function($controller) {
        ctrl = $controller('EditCtrl', {
          $scope: scope,
          $routeParams: {'fileName': 'foo'},
        });

        expect(scope.name).toBe('foo');
      }));

    });

  });
});
