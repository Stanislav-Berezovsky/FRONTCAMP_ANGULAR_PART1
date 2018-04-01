var toDoListApp = angular.module('toDoListApp', ["ngRoute","ngResource"]);

toDoListApp.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '../templates/listTemplate.html',
        controller: 'toDoItemController'
    });
    $routeProvider.when('/add', {
        templateUrl: '../templates/itemTemplate.html',
        controller: 'toDoItemController'
    });
    $routeProvider.when('/edit/:itemId', {
            templateUrl: '../templates/itemTemplate.html',
            controller: 'toDoItemController'
        })
        .otherwise({ template: '<h1>404 - not found such page</h1>' });
});