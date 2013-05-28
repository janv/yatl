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

  return TaskList;
});




/// TodoList //////////////////////////////////////////////////////////////////

todoApp.directive('todoList', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/todo_list.html'
  };
});

