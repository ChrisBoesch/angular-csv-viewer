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
    var download, downloadArgs, infoArgs, info, files;

    beforeEach(inject(function($rootScope, $q) {
      scope = $rootScope.$new();
      download = $q.defer();
      info = $q.defer();
      files = {
        download: function() {
          downloadArgs = arguments;
          return download.promise;
        },
        info: function() {
          infoArgs = arguments;
          return info.promise;
        }

      };
    }));

    describe('Initialization', function() {

      it('Should set an empty file name', inject(function($controller) {
        ctrl = $controller('EditCtrl', {
          '$scope': scope,
          '$routeParams': {'key': '0'},
          'files': files
        });

        expect(scope.metadata.name).toBe('');
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

        info.resolve({
          name: 'foo',
          key: 1234,
          lastMofified: 1234567890,
          hasHeaderRow: false,
          delimiter: ',',
          columns: [
            {encrypt: false, name: undefined},
            {encrypt: false, name: undefined},
            {encrypt: false, name: undefined}
          ]
        });
        download.resolve({'data': 'bob,foo,bar\nalice,baz,fooz'});
        scope.$apply();

        expect(scope.data).toEqual([['bob', 'foo', 'bar'], ['alice', 'baz', 'fooz']]);
        expect(scope.loading).toBe(false);
        expect(scope.metadata.columns.length).toEqual(3);
      }));
    });

  });
});
