// Copyright IBM Corp. 2013. All Rights Reserved.
// Node module: bacn
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular.module('<%= appname %>', [])
  .service('BindablePromise', function () {
    function BindablePromise(promise) {
      promise.then(function (value) {
        angular.extend(promise, value);
      });

      return promise;
    }

    return BindablePromise;
  })
  .service('Geolocation', function ($q, $rootScope) {
    var geolocation = {};

    geolocation.getCurrentPosition = function () {
      var deferred = $q.defer();

      console.log('Getting current position...');

      navigator.geolocation.getCurrentPosition(function (pos) {
        $rootScope.$apply(function () {
          console.log('Got: %s, %s', pos.coords.latitude, pos.coords.longitude);
          deferred.resolve(pos.coords);
        });
      }, function (err) {
        $rootScope.$apply(function () {
          console.log('Got error: %s', err.stack || err.message || err);
          deferred.reject(err);
        });
      });

      return deferred.promise;
    };

    return geolocation;
  })
  .controller('Main', function ($scope, Geolocation, BindablePromise) {
    $scope.version = '<%= version %>';
    $scope.location = BindablePromise(Geolocation.getCurrentPosition());

    console.log('Main controller loaded.');
  });

document.addEventListener('deviceready', function () {
  console.log('BACN v<%= version %> Loaded.');

  angular.bootstrap(document, ['<%= appname %>']);
}, false);
