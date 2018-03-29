angular.module('toDoListApp').controller("toDoItemController", function($scope, toDoItemService, $routeParams) {
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
    };

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
    };

    $scope.sortByDate = function() {
        toDoItemService.sortToDoLists($scope.filteredLists, 'date');
    };

    $scope.sortByTitle = function() {
        toDoItemService.sortToDoLists($scope.filteredLists, 'description');
    };
});