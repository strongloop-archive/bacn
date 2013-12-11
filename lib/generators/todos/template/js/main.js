angular.module('<%= appname %>', ['ngResource'])
  .service('TodosSvc', function ($resource) {
    var Todo = $resource('http://localhost:3000/todos/:todoId', { todoId: '@id' });
    var todos = {
      items: []
    };

    todos.addItem = addItem;
    function addItem(name) {
      var item = new Todo({ name: name });
      item.$save(function () {
        todos.items.push(item);
      });
    }

    todos.removeItem = removeItem;
    function removeItem(index) {
      var todo = todos.items[index];
      todo.$delete();

      todos.items.splice(index, 1);
    }

    todos.items = Todo.query();

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
