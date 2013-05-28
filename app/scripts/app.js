'use strict';

window.Hoodie.prototype.checkConnection = function () {};

var todoApp = angular.module('todoApp', []);




/// Classes ///////////////////////////////////////////////////////////////////

todoApp.factory('Task', function () {
  function Task(name, due) {
    this.name = name;
    this.due  = due;
    this.done = false;
  }

  Task.load = function (data) {
    var task = new Task(data.name, data.due);
    task.done = data.done;
    return task;
  };

  Task.prototype.dump = function () {
    return {
      name: this.name,
      due: this.due,
      done: this.done
    };
  };
  
  Task.prototype.resolve = function () {
    this.done = true;
  };

  return Task;
});

todoApp.factory('TaskList', function (Task) {
  function TaskList() {
    this.tasks = [];
  }

  TaskList.load = function (data) {
    var taskList = new TaskList();
    taskList.id = data.id;
    taskList.tasks = data.tasks.map(function (taskData) {
      return Task.load(taskData);
    });
    return taskList;
  };

  TaskList.prototype.dump = function () {
    return {
      id: '123',
      tasks: this.tasks.map(function (task) {
        return task.dump();
      })
    };
  };
  
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




/// Hoodie ///////////////////////////////////////////////////////////////////

todoApp.factory('hoodie', function () {
  return new window.Hoodie();
});

todoApp.factory('store', function (hoodie, $q, TaskList) {
  return {
    save: function (taskList) {
      return $q.when(hoodie.store.add('tasklist', taskList.dump()));
    },
    load: function () {
      return $q.when(
        hoodie.store.findAll('tasklist').then(function (tasklists) {
          if (tasklists.length === 0) { return undefined; }
          return TaskList.load(tasklists[0]);
        })
      );
    }
  };
});





/// TodoList //////////////////////////////////////////////////////////////////

todoApp.directive('todoList', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/todo_list.html',
    controller: 'todoListCtrl'
  };
});

todoApp.controller('todoListCtrl', function ($scope, TaskList, store) {
  $scope.taskList = new TaskList();
  store.load().then(function (taskList) {
    if (taskList) { $scope.taskList = taskList; }
  });

  function persistTodoList() {
    store.save($scope.taskList).then(function (x) {
      console.log('save success', x);
    }, function (x) {
      console.log('save fail', x);
    });
  }

  $scope.$on('taskAdded', persistTodoList);
  $scope.$on('taskChanged', persistTodoList);
  $scope.$on('listCleared', persistTodoList);
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
    $scope.$emit('taskChanged', task);
  };

  $scope.clearList = function () {
    $scope.taskList.clear();
    $scope.$emit('listCleared');
  };
});

