var toDoListApp = angular.module('toDoListApp', []);

toDoListApp.filter('itemsListDateFilter', function () {
    return function (items, dayCount) {
        var compareDate,
            now = new Date();

        dayCount = dayCount || 0;
        compareDate = new Date(now.getFullYear(),
            now.getMonth(), now.getDate() - dayCount);

        return items.filter(function (item) {
            return compareDate >= item.date;
        });
    }
});

toDoListApp.controller("toDoItemController", function ($scope) {
    var now = new Date();
    var toDoItemsList = [
        {
            description: 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
            isDone: false,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate())
        },
        {
            description: 'ppppppppppppppppppppp',
            isDone: true,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3)
        },
        {
            description: 'sssssssssssssssssssssss',
            isDone: true,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5)
        },
        {
            description: 'aaaaaaaaaaaaaaaaaaaaaaaa',
            isDone: false,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate())
        },
        {
            description: 'bbbbbbbbbbbbbbbbbbbbbbb',
            isDone: false,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10)
        },
        {
            description: 'tttttttttttttttttt',
            isDone: false,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5)
        }
    ];

    $scope.filteredLists = {
        processItemsList: [],
        doneItemsList: []
    };

    setFilteredList(toDoItemsList);

    $scope.changeToDoItemsState = function (item, itemIndex) {
        if (item.isDone) {
            $scope.filteredLists.processItemsList.splice(itemIndex, 1);
            $scope.filteredLists.doneItemsList.push(item);
        } else {
            $scope.filteredLists.doneItemsList.splice(itemIndex, 1);
            $scope.filteredLists.processItemsList.push(item);
        }
    };

    $scope.fil = function () {

    }

    function setFilteredList(itemsList) {
        itemsList.forEach(function (item) {
            (item.isDone ? $scope.filteredLists.doneItemsList :
                $scope.filteredLists.processItemsList).push(item);
        });
    };
});