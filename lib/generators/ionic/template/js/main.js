angular.module('<%= appname %>', ['ionic'])
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
    $scope.count = 0;

    console.log('Main controller loaded.');

    $scope.onRefresh = function () {
      $scope.count++;
      $scope.$broadcast('scroll.refreshComplete');

      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };
  });

document.addEventListener(window.cordova ? 'deviceready' : 'DOMContentLoaded', function () {
  console.log('BACN v<%= version %> Loaded.');

  angular.bootstrap(document, ['<%= appname %>']);
}, false);
