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