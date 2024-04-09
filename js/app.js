(function () {

    'use strict';

    angular.module('NarrowItDownApp', [])

    
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

    // so this errs bc 2 directives request isolate scope on same element
    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
        };

        return ddo;
    }


    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowctrl = this;

        narrowctrl.displaySearchedItems = function (searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

            promise.then(function (response) {
                narrowctrl.found = response;
            })
            .catch(function (error) {
                console.log("Error retrieving data " + error);
            });
        }

        narrowctrl.removeItem = function (itemIndex) {
            narrowctrl.found.splice(itemIndex, 1);
        }
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this; 

        /*
         * Get menu items that match a given search criteria
         */
        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json",
            })
            .then(
                function (result) {

                    var foundItems = [];

                    // loop over the shortnames
                    for(var shortName in result.data) {
                        
                        // loop over all of the menu arrays 
                        for (var i = 0; i < result.data[shortName].menu_items.length; i++) {
                            
                            // push objects to founditems ONLY IF the search term appears in them
                            var comparisonString = result.data[shortName].menu_items[i].description;

                            if(comparisonString.includes(searchTerm)) {
                                foundItems.push(result.data[shortName].menu_items[i]);
                            }
                        }
                    }

                    return foundItems;
                }
            )
        };
    }

})();