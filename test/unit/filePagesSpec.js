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

      it('Should decrypt encrypted columns', inject(function($controller){
        var lorem = 'A5IwaerPVzcIWOtCt3VBlkdIquXO8tnPuX1XtwuHGXyuAvA60K7VGgcvjunq2CbOz7bA78SDXokl\nYhLHWhCzua0aTWNCGGcmji6JRwTxbJVNtcDTqTv5C9iG2k7dkR0aa44URqZlYK/top/tHFvxI3on\nvCSin6hj8kAASfmgNyQ=\n';
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
            {encrypt: true, name: undefined}
          ]
        });
        download.resolve({'data': 'bob,foo,"'+lorem+'"\nalice,baz,"'+lorem+'"'});
        scope.pem = '-----BEGIN RSA PRIVATE KEY-----\nMIICXgIBAAKBgQDJ56nKs/k7EXy5O1SJyuAVQnb43p2Rq41mdkoqHdMt8I0/IY9t\n/Rg6F2F7UofvvFzPnnFkHRv5zDZL2qUlUmZ5XxD0KdTbmSnCYUmFMb1U3/HosgP9\nVND845Oz8Dmhah0RAMaB3PSZMNkvnZoR3Q/05r3coyIoYay2MMZ3dZ/lzQIDAQAB\nAoGAWC5cwtItxPWTQpc+CdxYWBCqQ3F+4hNJ83kwVQqnpAXOusbejMwgW6bAhYr7\nIeJjqq3pmi74e/YLtL9up0lAxXTsv9ugjYvIZnenJXEzRuEdlXZASaE/HzFGDbVz\n6Szztb5B+hEYocO+QPPI+KhkWOqP+HryjSzM0+MBtSk3V+UCQQDpnuhu+nE7pSlZ\nNA6Pq/62qUV7o1pTjRqe46vzxUnpzI5YPULY1Ssuv0SpJ6GWpKKlgIQ8JAulIpfN\nULvcxTTDAkEA3T78vt2EeCvPVEn40RaM1OBdaoEoXKxxS4Ap8QJ9Zcdy0a4sJNeT\ndjOG2tmzTA3GVoSgojWpVKyr73rGkBySLwJBAKoNGXNuqO2ZkzdzRQYfVBDxtboB\ndcZLd40gfBG9Ecg1NYfVT8s1n3EvmHLofh6BSELgAWEle7SAMa8pjRVuFrECQQCt\n7tDANGHqH3b1KtpDdljtGh4WlsdmY+MFmhJe+LgghbYMhcMKi7fQGx4Pe0prpgCh\nD89A9rLScJUSxhDIRs3dAkEAkvqbGH6FjuvoQwkr1ghvdXcBvjWvRFsqG+Z9jSC8\n81um5sINaWXyObtT0jfcEhDs2mcSaRL6YpcVxaE5lNtbzQ==\n-----END RSA PRIVATE KEY-----';
        scope.$apply();
        
        expect(scope.data).toEqual([['bob', 'foo', 'Lorem ipsum dolor sit amet'], ['alice', 'baz', 'Lorem ipsum dolor sit amet']]);
      }));
    });

  });
});
