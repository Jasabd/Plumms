'use strict';
var searchapp = angular.module('productsearch', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'rzModule']);


searchapp.config(function($locationProvider) {
  $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});

//https://github.com/angular-slider/angularjs-slider
searchapp.controller('MainController', ['$scope', '$rootScope', '$window', '$location',
    function($scope, $rootScope, $window, $location) {

        $scope.siteUrl = $window.model.siteUrl;
        $scope.allProducts = $window.model.products;
        $scope.isAgent = $window.model.isAgent;
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.materials = $window.model.materials;
        $scope.tags = $.unique($window.model.tags);
        $scope.items = $window.model.items;
        $scope.styles = $window.model.styles;
        $scope.selectedMaterial =[];
        $scope.selectedTags =[];
        $scope.selectedItem=[3];
        $scope.visibleFilter = true;
        $scope.selectedStyles =[];
        $scope.selectedSort ="new";
        $scope.reverseorder = true;
        $scope.sortItem="'dateAdded'";
        $scope.prdStatus={ "active" : "",
                            "custom": "",
                            "despick": ""};
        var cartObj = $window.cart;
        var queryParam = $location.search();
        if(queryParam.m){
              $scope.selectedMaterial.push(parseInt(queryParam.m,10));
        }
        if(queryParam.t){
              $scope.selectedTags.push(queryParam.t);
        }

        $.each($scope.allProducts, function(ix, prd){
             prd.dateAdded = new Date(prd.dateAdded* 1000);
         });

        console.log($scope.allProducts);

        var findInString = function(str, arr) {
            var found= false;
            $.each(arr, function(ind, val){
                if(str.indexOf(val) > -1) {
                    found =true;
                    return false;
                }
                found = false;
            });
            return found;
         }

        // console.log($scope.allProducts);

        $scope.toggleFilter = function() {
             $scope.visibleFilter = !$scope.visibleFilter;
        }

        $scope.orderByOptions = function() {
          $scope.currentPage = 1;
            if($scope.selectedSort == "new") {
                $scope.reverseorder = true;
                $scope.sortItem = "'dateAdded'";
            }
            else if($scope.selectedSort == "phigh" ){
                $scope.reverseorder = true;
                $scope.sortItem = "'price'";
            }
            else if( $scope.selectedSort == "plow") {
                $scope.reverseorder = false;
                $scope.sortItem = "'price'";
            }
        };

         $scope.priceSlider = {
                 min: 0,
                  max: 1000,
                  options: {
                    floor: 0,
                    step: 10,
                    ceil: 1000,
                    translate: function(value) {
                      return 'Rs.' + value;
                    },
                    onChange : function(sliderId, modelValue, highValue) {
                      $scope.currentPage = 1;
                    }
                  }
            };

        // toggle selection for a given fruit by name
        $scope.toggleSelection = function toggleSelection(matIndex) {
             $scope.currentPage = 1;

            var idx = $scope.selectedMaterial.indexOf(matIndex);
            // is currently selected
            if (idx > -1) {
              $scope.selectedMaterial.splice(idx, 1);
            }
            // is newly selected
            else {
              $scope.selectedMaterial.push(matIndex);
            }
        };

                // toggle selection for a given style by name
        $scope.toggleStyleSelection = function toggleStyleSelection(styleItem) {
            var idx = $scope.selectedStyles.indexOf(styleItem);
            // is currently selected
            if (idx > -1) {
              $scope.selectedStyles.splice(idx, 1);
            }
            // is newly selected
            else {
              $scope.selectedStyles.push(styleItem);
            }
        };

        $scope.toggleTagSelection = function toggleTagSelection(tagIndx) {
             $scope.currentPage = 1;
            var idx = $scope.selectedTags.indexOf(tagIndx);
            // is currently selected
            if (idx > -1) {
              $scope.selectedTags.splice(idx, 1);
            }
            // is newly selected
            else {
              $scope.selectedTags.push(tagIndx);
            }
        };

        $scope.toggleItemSelection = function toggleItemSelection(itmIndex) {
             $scope.currentPage =  1;
            var idx = $scope.selectedItem.indexOf(itmIndex);
            // is currently selected
            if (idx > -1) {
              $scope.selectedItem.splice(idx, 1);
            }
            // is newly selected
            else {
              $scope.selectedItem.push(itmIndex);
            }
        };


        $scope.criterias = function(item) {
            var foundMat = false;
            var foundPrice = false;
             var foundItem = false;
             var foundStatus=false;
             var foundCustom=false;
             var foundDpick=false;
             var foundTags= false;
            var foundStyles = false;

             if(!$scope.isAgent || $scope.prdStatus.active == "") foundStatus = true;
             else {
                if(parseInt($scope.prdStatus.active, 10) == item.status){
                    foundStatus= true;
                }
             }
              if(($scope.selectedTags.length == 0) || ($scope.selectedTags.indexOf(item.tags) > -1)){
                foundTags = true;
            }
             if(!$scope.isAgent || $scope.prdStatus.despick == "") foundDpick = true;
             else {
                if(parseInt($scope.prdStatus.despick, 10) == item.designerPick){
                    foundDpick= true;
                }
             }
            if(!$scope.isAgent || $scope.prdStatus.custom == "") foundCustom = true;
             else {
                if(parseInt($scope.prdStatus.custom, 10) == item.customized){
                    foundCustom= true;
                }
             }
             if(($scope.selectedStyles.length == 0) || (item.style && findInString(item.style, $scope.selectedStyles))){
                foundStyles    = true;
            }

            if($scope.selectedMaterial.length > 0) {
                if($scope.selectedMaterial.indexOf(item.material) > -1){
                    foundMat = true;
                }
            }
            else {
                foundMat = true;//make it true for all materials here.
            }
            if(item.price >= $scope.priceSlider.min && item.price <= $scope.priceSlider.max ){
                foundPrice = true;
            }
            if(($scope.selectedItem.length == 0) || ($scope.selectedItem.indexOf(item.bodypart) > -1)){
                foundItem = true;
            }

            return (foundMat && foundPrice && foundItem && foundStatus && foundCustom && foundDpick && foundTags && foundStyles);
        };

        $scope.addCartItem = function(pid, pprice){
            cartObj.updateCart(pid, parseFloat(pprice,10));
            cartObj.openCloseCart();

             // $("div.cart-box").slideDown('slow').delay(1000).slideUp('slow');
        };

        $scope.numberOfPages=function(){
            return Math.ceil($scope.resultSet.length/$scope.pageSize);
        };

        $scope.prevPage = function() {
          $scope.currentPage=$scope.currentPage-1;
          window.scrollTo(0,0);
        };
        $scope.nextPage = function() {
          $scope.currentPage=$scope.currentPage+1;
          window.scrollTo(0,0);
        };

}]);

searchapp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        console.log(start);
        return input.slice(start);
    }
});

searchapp.filter('mathround', function() {
    return function(input) {
        return Math.round(input);
    }
});


searchapp.directive("filterSlide",  function() {
                // I allow an instance of the directive to be hooked
                // into the user-interaction model outside of the
                // AngularJS context.
                function link( $scope, element, attributes ) {
                    // I am the TRUTHY expression to watch.
                    var expression = attributes.filterSlide;
                    // I am the optional slide duration.
                    var duration = ( attributes.slideDuration || "fast" );
                    // I check to see the default display of the
                    // element based on the link-time value of the
                    // model we are watching.
                    if ( ! $scope.$eval( expression ) ) {
                        element.hide();
                    }
                    // I watch the expression in $scope context to
                    // see when it changes - and adjust the visibility
                    // of the element accordingly.
                    $scope.$watch(
                        expression,
                        function( newValue, oldValue ) {
                            // Ignore first-run values since we've
                            // already defaulted the element state.
                            if ( newValue === oldValue ) {
                                return;
                            }
                            // Show element.
                            if ( newValue ) {
                                element
                                    .stop( true, true )
                                    .slideDown( duration )
                                ;
                            // Hide element.
                            } else {
                                element
                                    .stop( true, true )
                                    .slideUp( duration )
                                ;
                            }
                        }
                    );
                }
                // Return the directive configuration.
                return({
                    link: link,
                    restrict: "A"
                });
    });
