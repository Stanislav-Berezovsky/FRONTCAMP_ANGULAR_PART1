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
angular.module('toDoListApp').controller("toDoItemController", function($scope, toDoItemService, $routeParams,$location,toDoItemFactory) {
    $scope.toDoItem = {
        itemId: -1,
        text: ''
    };

    $scope.filteredLists = {
        processItemsList: [],
        doneItemsList: []
    };

    toDoItemService.getToDoItemList().then(function(date) {
        $scope.filteredLists = date.filteredLists;

        if ($routeParams.itemId) {
            var itemId = Number($routeParams.itemId),
                itemForUpdate,
                itemIndex = $scope.filteredLists.processItemsList.map(function(item) {
                    return item.itemId;
                }).indexOf(itemId);

            if (itemIndex !== -1) {
                itemForUpdate = $scope.filteredLists.processItemsList[itemIndex];
            } else {
                itemIndex = $scope.filteredLists.doneItemsList.map(function(item) {
                    return item.itemId;
                }).indexOf(itemId);

                itemForUpdate = $scope.filteredLists.doneItemsList[itemIndex];
            }

            $scope.toDoItem = angular.copy(itemForUpdate) || $scope.toDoItem;
            $scope.toDoItem.text = $scope.toDoItem.description;
            $scope.toDoItem.index = itemIndex;
        }
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

    $scope.addNewItem = function(item, itemForm) {
        if (!itemForm.$valid) {
            $scope.showInvalidMessage = 'Text for to do item should contain as minimal 20 character ';
            return;
        }

        toDoItemService.addNewItem(item.text);
        $scope.showInvalidMessage = $scope.toDoItem.text = "";
        $location.path('/');
    };

    $scope.updateItem = function(item, itemForm) {
        if (!itemForm.$valid) {
            $scope.showInvalidMessage = 'Text for to do item should contain as minimal 20 character ';
            return;
        }

        if (item.itemId === -1) {
            $scope.showInvalidMessage = 'Current item is not exist in items lists, use add form to create new one';
            return;
        }

        toDoItemService.updateItem(item);
        $scope.showInvalidMessage = $scope.toDoItem.text = "";
        $location.path('/');
    };

    $scope.sortByDate = function() {
        toDoItemService.sortToDoLists($scope.filteredLists, 'date');
    };

    $scope.sortByTitle = function() {
        toDoItemService.sortToDoLists($scope.filteredLists, 'description');
    };
});
angular.module('toDoListApp').factory('toDoItemFactory', function($resource) {
    return $resource('/serverResponse/:fileId.:format', {
        fileId: 'toDoList',
        format: 'json'
    });
});
angular.module('toDoListApp').service('toDoItemService', function($http, $q, toDoItemFactory) {
    var sortOrder = {
            description: true,
            date: true
        },
        filteredLists,
        lastItemIndex = 0;

    function getToDoItemList() {
        return (filteredLists && lastItemIndex) ? $q.resolve({ filteredLists: filteredLists }) :
            toDoItemFactory.query().$promise.then(function(response) {
                var toDoList = response.map(function(item) {
                    item.date = new Date(item.date);
                    return item;
                });

                return setFilteredList(toDoList);
            });
    }

    function addNewItem(description) {
        var now = new Date(),
            newItem = {
                itemId: lastItemIndex++,
                description: description,
                date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                isDone: false
            };

        filteredLists.processItemsList.push(newItem);
    }

    function updateItem(item) {
        (item.isDone ? filteredLists.doneItemsList : filteredLists.processItemsList)[item.index].description = item.text;
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


    function setFilteredList(itemsList) {
        filteredLists = {
            doneItemsList: [],
            processItemsList: []
        };

        lastItemIndex = itemsList.length;

        itemsList.forEach(function(item) {
            (item.isDone ? filteredLists.doneItemsList :
                filteredLists.processItemsList).push(item);
        });

        return {
            filteredLists: filteredLists
        };
    }

    return {
        getToDoItemList: getToDoItemList,
        sortToDoLists: sortToDoLists,
        addNewItem: addNewItem,
        updateItem: updateItem
    };
});
angular.module('toDoListApp').filter('itemsListDateFilter', function() {
    return function(items, dayCount) {
        var compareDate,
            now = new Date();

        dayCount = dayCount || 0;
        compareDate = new Date(now.getFullYear(),
            now.getMonth(), now.getDate() - dayCount);

        return items.filter(function(item) {
            return compareDate >= item.date;
        });
    };
});