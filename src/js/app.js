var toDoListApp = angular.module('toDoListApp', []);

toDoListApp.controller("toDoItemController", function($scope) {
    var todaysDateAndTime = new Date();
    $scope.toDoItemsList = [{
            description: 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
            isDone: false,
            date: todaysDateAndTime
        },
        {
            description: 'ppppppppppppppppppppp',
            isDone: true,
            date: new Date(todaysDateAndTime.getFullYear(), todaysDateAndTime.getMonth(), todaysDateAndTime.getDate() - 3)
        },
        {
            description: 'sssssssssssssssssssssss',
            isDone: true,
            date: new Date(todaysDateAndTime.getFullYear(), todaysDateAndTime.getMonth(), todaysDateAndTime.getDate() - 5)
        },
        {
            description: 'aaaaaaaaaaaaaaaaaaaaaaaa',
            isDone: false,
            date: todaysDateAndTime
        },
        {
            description: 'bbbbbbbbbbbbbbbbbbbbbbb',
            isDone: false,
            date: new Date(todaysDateAndTime.getFullYear(), todaysDateAndTime.getMonth(), todaysDateAndTime.getDate() - 10)
        },
        {
            description: 'tttttttttttttttttt',
            isDone: false,
            date: new Date(todaysDateAndTime.getFullYear(), todaysDateAndTime.getMonth(), todaysDateAndTime.getDate() - 5)
        }
    ];

    $scope.filteredLists = {
        processItemsList: [],
        doneItemsList: []
    };

    $scope.toDoItemsList.forEach(function(item) {
       	(item.isDone ? $scope.filteredLists.doneItemsList : 
       		$scope.filteredLists.processItemsList).push(item);
    });

});