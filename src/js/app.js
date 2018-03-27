var toDoListApp = angular.module('toDoListApp', []);

toDoListApp.filter('itemsListDateFilter', function() {
    return function(items, dayCount) {
        var compareDate,
            now = new Date();

        dayCount = dayCount || 0;
        compareDate = new Date(now.getFullYear(),
            now.getMonth(), now.getDate() - dayCount);

        return items.filter(function(item) {
            return compareDate >= item.date;
        });
    }
});

toDoListApp.service('toDoItemService', function($http) {
    var sortOrder = {
        description: true,
        date: true
    };

    function getToDoItemList() {
        return $http({ method: 'GET', url: '../serverResponse/toDoList.json' })
            .then(function(response) {
                var toDoList = response.data.list;

                toDoList.forEach(function(item) {
                    item.date = new Date(item.date);
                    return item;
                });

                return toDoList;
            })
    }

    function sortToDoLists(itemLists, key) {
        itemLists.processItemsList.sort(sortOrder[key] ? increaseSort : decreaseSort);
        itemLists.doneItemsList.sort(sortOrder[key] ? increaseSort : decreaseSort);

        sortOrder[key] = !sortOrder[key];

        // need add toLowerCase for string types;
        function increaseSort(first, second) {
            return (first[key] > second[key]) ? 1 :
                (first[key] < second[key]) ? -1 : 0;
        }

        function decreaseSort(first, second) {
            return (first[key] > second[key]) ? -1 :
                (first[key] < second[key]) ? 1 : 0;
        }
    }

    return {
        getToDoItemList: getToDoItemList,
        sortToDoLists: sortToDoLists
    }
});

toDoListApp.controller("toDoItemController", function($scope, toDoItemService) {
    var now = new Date(),
        lastItemIndex;

    $scope.newItemText = '';

    $scope.filteredLists = {
        processItemsList: [],
        doneItemsList: []
    };

    toDoItemService.getToDoItemList().then(function(list) {
        lastItemIndex = list.length;
        setFilteredList(list);
    });

    $scope.changeToDoItemsState = function(item, itemIndex) {
        if (item.isDone) {
            $scope.filteredLists.processItemsList.splice(itemIndex, 1);
            $scope.filteredLists.doneItemsList.push(item);
        } else {
            $scope.filteredLists.doneItemsList.splice(itemIndex, 1);
            $scope.filteredLists.processItemsList.push(item);
        }
    };

    $scope.addNewItem = function(text, itemForm) {
        if (!itemForm.$valid) {
            alert('Text for to do item should contain as minimal 20 character ');
            return;
        }

        var newItem = {
            itemId: lastItemIndex++,
            description: text,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            isDone: false
        }

        $scope.filteredLists.processItemsList.push(newItem);
    }

    $scope.sortByDate = function() {
        toDoItemService.sortToDoLists($scope.filteredLists, 'date');
    }

    $scope.sortByTitle = function() {
        toDoItemService.sortToDoLists($scope.filteredLists, 'description');
    }

    function setFilteredList(itemsList) {
        itemsList.forEach(function(item) {
            (item.isDone ? $scope.filteredLists.doneItemsList :
                $scope.filteredLists.processItemsList).push(item);
        });
    };
});