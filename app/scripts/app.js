'use strict';

var todoApp = angular.module('todoApp', []);




/// Classes ///////////////////////////////////////////////////////////////////

todoApp.factory('Task', function () {
  function Task(name, due) {
    this.name = name;
    this.due  = due;
    this.done = false;
  }

  Task.prototype.resolve = function () {
    this.done = true;
  };

  return Task;
});

todoApp.factory('TaskList', function () {
  function TaskList() {
    this.tasks = [];
  }

  TaskList.prototype.add = function (task) {
    this.tasks.push(task);
  };

  TaskList.prototype.count = function () {
    return this.tasks.length;
  };

  TaskList.prototype.clear = function () {
    var i = this.tasks.length;
    while (i--) {
      if (this.tasks[i].done) {
        this.tasks.splice(i, 1);
      }
    }
  };
  
  TaskList.prototype.getOpenTasks = function () {
    return this.tasks.filter(function (task) {
      return !task.done;
    });
  };

  TaskList.prototype.getFinishedTasks = function () {
    return this.tasks.filter(function (task) {
      return task.done;
    });
  };
  
  return TaskList;
});




/// TodoList //////////////////////////////////////////////////////////////////

todoApp.directive('todoList', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/todo_list.html',
    controller: 'todoListCtrl'
  };
});

todoApp.controller('todoListCtrl', function ($scope, TaskList, Task) {
  $scope.taskList = new TaskList();
  $scope.taskList.add(new Task('foo'));
});
    




/// TodoForm //////////////////////////////////////////////////////////////////

todoApp.directive('todoForm', function () {
  return {
    restrict: 'C',
    templateUrl: 'views/todo_form.html',
    controller: 'todoFormCtrl'
  };
});

todoApp.controller('todoFormCtrl', function ($scope, Task) {
  $scope.newTask = new Task();

  $scope.addTask = function () {
    $scope.taskList.add($scope.newTask);
    $scope.$emit('taskAdded', $scope.newTask);
    $scope.newTask = new Task();
  };
});




/// TodoTable /////////////////////////////////////////////////////////////////

todoApp.directive('todoTable', function () {
  return {
    restrict: 'C',
    templateUrl: 'views/todo_table.html',
    controller: 'todoTableCtrl'
  };
});

todoApp.controller('todoTableCtrl', function ($scope) {
  $scope.toggleTask = function (task) {
    task.done = !task.done;
  };

  $scope.clearList = function () {
    $scope.taskList.clear();
  };
});

