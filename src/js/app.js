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

toDoListApp.service('toDoItemService', function($http, $q) {
    var sortOrder = {
            description: true,
            date: true
        },
        filteredLists,
        lastItemIndex = 0;

    function getToDoItemList() {
        return (filteredLists && lastItemIndex) ? $q.resolve({ filteredLists: filteredLists }) :
            $http({ method: 'GET', url: '../serverResponse/toDoList.json' })
            .then(function(response) {
                var toDoList = response.data.list;

                toDoList.forEach(function(item) {
                    item.date = new Date(item.date);
                    return item;
                });

                return setFilteredList(toDoList);
            })
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
    	(item.isDone ? filteredLists.doneItemsList: filteredLists.processItemsList)[item.index].description = item.text;
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
        }

        lastItemIndex = itemsList.length;

        itemsList.forEach(function(item) {
            (item.isDone ? filteredLists.doneItemsList :
                filteredLists.processItemsList).push(item);
        });

        return {
            filteredLists: filteredLists
        }
    }

    return {
        getToDoItemList: getToDoItemList,
        sortToDoLists: sortToDoLists,
        addNewItem: addNewItem,
        updateItem:updateItem
    }
});

toDoListApp.controller("toDoItemController", function($scope, toDoItemService, $routeParams) {
    $scope.toDoItem = {
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
            $scope.toDoItem.text =  $scope.toDoItem.description;
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

    $scope.addNewItem = function(text, itemForm) {
        if (!itemForm.$valid) {
            alert('Text for to do item should contain as minimal 20 character ');
            return;
        }

        toDoItemService.addNewItem(text);
        $scope.toDoItem.text = "";
        alert('new to do item was added');
    }

    $scope.updateItem = function(item, itemForm) {
        if (!itemForm.$valid) {
            alert('Text for to do item should contain as minimal 20 character ');
            return;
        }

        if (item.index === -1){
        	alert('current item is not exist in items lists');
        	return;
        }

		toDoItemService.updateItem(item);
        $scope.toDoItem.text = "";
        alert('to do item was updated');
    }

    $scope.sortByDate = function() {
        toDoItemService.sortToDoLists($scope.filteredLists, 'date');
    }

    $scope.sortByTitle = function() {
        toDoItemService.sortToDoLists($scope.filteredLists, 'description');
    }
});