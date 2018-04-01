angular.module('toDoListApp').factory('toDoItemFactory', function($resource) {
    return $resource('/serverResponse/:fileId.:format', {
        fileId: 'toDoList',
        format: 'json'
    });
});