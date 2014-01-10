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
    var download, downloadArgs, files;

    beforeEach(inject(function($rootScope, $q) {
      scope = $rootScope.$new();
      download = $q.defer();
      files = {
        download: function() {
          downloadArgs = arguments;
          return download.promise;
        }
      };
    }));

    describe('Initialization', function() {

      it('Should set file name', inject(function($controller) {
        ctrl = $controller('EditCtrl', {
          '$scope': scope,
          '$routeParams': {'fileName': 'foo'},
          'files': files
        });

        expect(scope.name).toBe('foo');
      }));

      it('Should set empty data content', inject(function($controller) {
        ctrl = $controller('EditCtrl', {
          '$scope': scope,
          '$routeParams': {'fileName': 'foo'},
          'files': files
        });

        expect(scope.data).toEqual([]);
        expect(scope.range()).toEqual([]);
      }));

      it('Should set loading attribute', inject(function($controller) {
        ctrl = $controller('EditCtrl', {
          '$scope': scope,
          '$routeParams': {'fileName': 'foo'},
          'files': files
        });

        expect(scope.loading).toEqual(true);
      }));

    });

    describe('file download', function(){
      it('Should parse received data', inject(function($controller) {
        ctrl = $controller('EditCtrl', {
          '$scope': scope,
          '$routeParams': {'fileName': 'foo'},
          'files': files
        });

        download.resolve({'data': 'bob,foo,bar\nalice,baz,fooz'});
        scope.$apply();

        expect(scope.data).toEqual([['bob', 'foo', 'bar'], ['alice', 'baz', 'fooz']]);
        expect(scope.loading).toBe(false);
        expect(scope.colCount).toEqual(3);
      }));
    });

  });
});
