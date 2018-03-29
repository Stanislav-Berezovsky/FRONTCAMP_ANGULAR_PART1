var toDoListApp = angular.module('toDoListApp', ["ngRoute"]);

toDoListApp.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '../templates/listTemplate.html',
        controller: 'toDoItemController'
    });
    $routeProvider.when('/add', {
        templateUrl: '../templates/additionTemplate.html',
        controller: 'toDoItemController'
    });
    $routeProvider.when('/edit/:itemId', {
            templateUrl: '../templates/editTemplate.html',
            controller: 'toDoItemController'
        })
        .otherwise({ template: '<h1>404 - not found such page</h1>' });
});