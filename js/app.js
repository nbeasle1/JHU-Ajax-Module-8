(function () {

    'use strict';

    angular.module('NarrowItDownApp', [])

    //controllers
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowctrl = this;
        

        // this needs to be called from the HTML to get the param (i think?)
        var promise = MenuSearchService.getMatchedMenuItems("chicken");

        



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
                                foundItems.push(result.data[shortName].menu_items[i].description);
                            }
                        }
                        
                    }

                    return foundItems;
                }
            )

        };

        
    }



})();