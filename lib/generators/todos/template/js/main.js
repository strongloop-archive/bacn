angular.module('<%= appname %>', [])
  .service('TodosSvc', function () {
    var todos = {
      items: []
    };

    todos.addItem = addItem;
    function addItem(name) {
      return todos.items.push(name) - 1;
    }

    todos.removeItem = removeItem;
    function removeItem(index) {
      todos.items.splice(index, 1);
    }

    return todos;
  })
  .controller('TodosCtrl', function ($scope, TodosSvc) {
    $scope.items = TodosSvc.items;
    $scope.name = '';

    $scope.add = function () {
      TodosSvc.addItem($scope.name);
      $scope.name = '';
    };

    $scope.cancel = function (index) {
      TodosSvc.removeItem(index);
    };
    $scope.complete = function (index) {
      TodosSvc.removeItem(index);
    };
  });

document.addEventListener(window.cordova ? 'deviceready' : 'DOMContentLoaded', function () {
  console.log('BACN v<%= version %> Loaded.');

  angular.bootstrap(document, ['<%= appname %>']);
}, false);
