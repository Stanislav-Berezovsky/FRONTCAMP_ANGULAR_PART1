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