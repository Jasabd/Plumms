'use strict';
var des = angular.module('cdesign', []);

 des.config(function($locationProvider) {
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });
    });

des.controller('MainController', ['$scope', '$rootScope', '$http', '$window', '$document', '$timeout', '$location',
    function($scope, $rootScope, $http, $window, $document, $timeout, $location) {

        $scope.siteUrl = $window.model.siteUrl;
        $scope.designObj = {};
        $scope.filteredSet = [];
        $scope.mySelectedItems = [];
        $scope.designLevel = 0;
        $scope.pageSize = 12;
        $scope.currentPage = 0;
        $scope.levelFilled = false;
        $scope.prdIndex = [];
        $scope.allConnArr =[];
        $scope.designerPicks=[];
        $scope.designPrice=0;
        $scope.isAgent = $window.model.isAgent;
        $scope.shipping=$window.model.shipping;
        $scope.productAdded = false;
        $scope.startType = "";
        $scope.showCartbtn = false;
        var marginPercent =$window.model.margin;
        var taxPercent =$window.model.vat;
        var overheads =$window.model.overheads;

        var elements = $window.model.elements;
        var bodyparts = $window.model.items;

        var queryParam = $location.search();
        if(queryParam.jhumka){
              $scope.startType = "Jhumka";
        }
        else if(queryParam.chandelier){
              $scope.startType = "Chandelier";
        }
        else if(queryParam.hoops){
              $scope.startType = "Hoops";
        }
        else if(queryParam.studs){
              $scope.startType = "Studs";
        }
        else if(queryParam.danglers){
              $scope.startType = "Danglers";
        }


        var isOdd = function(num){
            return num % 2;
        };

        var findEligibleElement = function(eitems, celem){
            var resArr = [];
            /*
             var prevXs = prevItem.botX.split(",");
            var currXs = row.topX.split(",");
            var matchingPoints =true;
            for(var i=0; i< topPoints && matchingPoints; i++){

                if(Math.abs((currXs[i+1] - currXs[i]) - (prevXs[i+1] - prevXs[i])) > 5)
                    matchingPoints=false;
                        }
            */
            $.each(eitems, function(ind, row) {
                resArr.push(row);
            });
            return resArr;
        };

        var findConnectionElements = function(eitems) {
            var resArr = [];
            var prevItem;
            var topPoints = 0;

            if ($scope.designLevel != 0) {
                prevItem = $scope.mySelectedItems[$scope.designLevel - 1];
                topPoints = prevItem.bottompoints;
            }
            if ($scope.designLevel != 0 && topPoints == 0) {
                return resArr;
            }

            $.each(eitems, function(ind, row) {
                if ($scope.designLevel == 0) {
                    // if (row.toppoints == 0 && row.admintags.indexOf($scope.startType)) {
                   if (row.toppoints == 0) {
                        resArr.push(row);
                    }
                } else {
                    if(row.toppoints == 1){
                        if($scope.designLevel == 3){
                            if(row.bottompoints == 0)
                                resArr.push(row);
                        }
                        else
                          resArr.push(row);
                    }
                    if (row.toppoints == topPoints && row.toppoints != 1) {
                        var prevXs = prevItem.botX.split(",");
                        var currXs = row.topX.split(",");
                        var matchingPoints =true;
                        for(var i=0; i< topPoints && matchingPoints; i++){

                            if(Math.abs((currXs[i+1] - currXs[i]) - (prevXs[i+1] - prevXs[i])) > 5)
                                matchingPoints=false;
                        }
                        if($scope.designLevel == 3){
                            if(matchingPoints && row.bottompoints == 0)
                            resArr.push(row);
                        }
                        else if(matchingPoints)
                         resArr.push(row);
                    }
                }

            });
            return resArr;
        };

        var updateDesignerPick = function() {
            // console.log($scope.mySelectedItems);
            var elementIdArr = [];
            $.each($scope.mySelectedItems, function(ind, itm){
                elementIdArr.push(itm.id);
            });
            if(elementIdArr.length == 0) return;
            var payload = {
                        elementids : elementIdArr
                        };

            $http({
              method  : 'POST',
              url     : $scope.siteUrl+'php/ajax.php?despicks',
              data    : payload  // pass in data as strings
             })
              .success(function(data) {
                 if(data.products && data.products.length > 0) {
                    $scope.designerPicks = data.products;
                 }
                 else {
                    $scope.designerPicks = [];
                 }
              });
        };

        $.each(bodyparts, function(index, item) {
            $scope.designObj[item] = [];
        });

        $.each(elements, function(ind, element) {
            if (element.bodypart == 3 && element.admintags.toLowerCase().indexOf($scope.startType.toLowerCase()) > -1) {
           // if (element.bodypart == 3 ) {
                $scope.designObj["Earrings"].push(element);
            }
            if (element.bodypart == 1) {
                $scope.designObj["Anklets"].push(element);
            }
        });

        $scope.filteredSet =  findConnectionElements($scope.designObj.Earrings);

        $scope.selectImage = function(elem, mainlist) {
            $scope.levelFilled = true;
            var bpoints = ($scope.mySelectedItems.length ==0) ? 1 : 0;
            var tpoints = elem.toppoints;
            var indexToRemove = 0;
            var numberToRemove = 0;
            var prevElsArr=[];
            var numberOfElemInPrevLevel =0;
            var lastLevelEl = [];
            var fits = true;

             if($scope.designLevel ==0 && elem.admintags.indexOf('hook') > -1)
                $scope.showCartbtn = false;
             else
              $scope.showCartbtn = true;

            // This is when different images in carousel is selected after
            //the level is filled but next level is not  reached.
            if($scope.prdIndex[$scope.designLevel]) {
                indexToRemove = $scope.prdIndex[$scope.designLevel][0];
                numberToRemove = $scope.prdIndex[$scope.designLevel].length;
            }

            if($scope.designLevel > 0) {
              prevElsArr = $scope.prdIndex[$scope.designLevel-1];
              numberOfElemInPrevLevel = prevElsArr.length;

                //for multi point elements we need to figure out if there are going to be
                //multiple next level elements or only one in the middle
                $.each(prevElsArr, function(ix, elPos){
                    var cElem = $scope.mySelectedItems[elPos];
                    var curBpoints =  cElem.bottompoints;
                    if(isOdd(curBpoints) && curBpoints > 1 && elem.toppoints == 1) {
                        var botXs=  cElem.botX.split(",");
                        var botYs=  cElem.botY.split(",");
                        var curWidth = elem.imgwidth;
                        for(var i=0; i < botXs.length && fits; i++){
                            var  a = botXs[i+1] - botXs[i];
                            var b = botYs[i+1] - botYs[i];
                           // console.log(Math.sqrt(a*a + b*b));
                            if(Math.sqrt(a*a + b*b) <= curWidth) {
                                fits=false;
                            }
                        }
                    }
                    else {
                        $scope.filteredSet = findEligibleElement($scope.filteredSet, elem);
                    }
                    if(fits) {
                         bpoints += $scope.mySelectedItems[elPos].bottompoints;
                    }
                    else {
                         bpoints += 1;
                    }
                });

                var prevConnArrLength = $scope.allConnArr[$scope.designLevel-1].length;
                $.each($scope.allConnArr[$scope.designLevel-1], function(ix, elPos){
                    if(fits) {
                        lastLevelEl.push($scope.mySelectedItems[elPos.split(',')[0]]);
                    }
                    else if(ix == Math.floor(prevConnArrLength/2))  {
                        lastLevelEl.push($scope.mySelectedItems[elPos.split(',')[0]]);
                    }
                });
            }
            if (mainlist) {
                $scope.prdIndex.splice($scope.designLevel, 1);
                $scope.allConnArr.splice($scope.designLevel, 1);
                $scope.mySelectedItems.splice(indexToRemove, numberToRemove);

                var pos = $scope.mySelectedItems.length;
                if(tpoints == bpoints) {
                     tpoints = 1; bpoints= 1;
                }

                var indexArr =[];
                var connArr =[];
                for(var i=0; i< bpoints; i++){
                    var currBottomPoints = (elem.bottompoints == 0) ? 1 : parseInt(elem.bottompoints, 10);
                    if(!fits) {
                        connArr.push(pos+","+Math.floor(prevConnArrLength/2));
                    }
                    else {
                        for(var j=0; j< currBottomPoints; j++) {
                           connArr.push(pos+","+j);
                        }
                    }

                    indexArr.push(pos);

                    var element = {};
                    angular.copy(elem, element)
                    element.selectedImage = element.carouselImg;
                                //Calculating topPos and leftPos
                    var topPos = 0;
                    var leftPos = 0;

                    if ($scope.designLevel != 0) {
                        var prevElement = null;
                        prevElement = lastLevelEl[i];
                        topPos += parseInt(prevElement.topPos, 10);
                        leftPos += parseInt(prevElement.leftPos, 10);
                        var connPoint;
                        if(fits) {
                            connPoint = $scope.allConnArr[$scope.designLevel-1][i];
                        }
                        else  {
                            connPoint = $scope.allConnArr[$scope.designLevel-1][Math.floor(prevConnArrLength/2)];
                        }

                        if(prevElement.bottompoints > 1){
                             var botPoints = prevElement.botY.split(",");
                             topPos += parseInt(botPoints[connPoint.split(",")[1]], 10);
                             var tPoints = prevElement.botX.split(",");
                             if(element.toppoints == 1) {
                                leftPos += parseInt(tPoints[connPoint.split(",")[1]], 10) - parseInt(element.topX, 10);
                             }
                        }
                        else {
                             topPos += parseInt(prevElement.botY, 10);
                             if(element.toppoints == 1) {
                                leftPos += parseInt(prevElement.botX, 10) - parseInt(element.topX, 10);
                             }
                        }
                    }
                    else {
                        leftPos += parseInt(element.centerx, 10);
                        topPos += parseInt(element.centery, 10);
                    }
                    element.topPos = topPos;
                    element.leftPos = leftPos;
                    $scope.mySelectedItems.push(element);
                    pos++;
                }
                $scope.prdIndex.push(indexArr);
                $scope.allConnArr.push(connArr);
                //mainlist ends here
                //call the service to update designer's pick
                updateDesignerPick();
                designTotal();
            } else {
               // var pos = ($scope.designLevel > 0) ? numberOfElemInPrevLevel : 0;
                bpoints = ($scope.designLevel == 0 ) ? 1 : bpoints;
                for (var i = 0; i < bpoints; i++) {
                    $scope.mySelectedItems[$scope.prdIndex[$scope.designLevel][i]].selectedImage = elem;
                }
            }
        };

        $scope.updateLevel = function() {
            if($scope.levelFilled) {
                $scope.designLevel++;
                $scope.levelFilled = false;
                $scope.filteredSet = findConnectionElements($scope.designObj.Earrings);
                $('.white_content').hide(); $('.black_overlay').hide(); $('.lightboxClose').hide();
            } else {
                alert("you havent selected elements for this level yet.");
            }

        };

        var designTotal = function(){
            var total = 0;
            var marginFactor = 1 + marginPercent/100;
            var overheadFactor = 1 + overheads/100;
            var taxFactor = 1 + taxPercent/100;

            $.each($scope.mySelectedItems, function(indx, sitem){
                  total = total + parseFloat(sitem.price, 10);
            });

            total  = total * marginFactor *overheadFactor *taxFactor;
            $scope.designPrice = Math.round(total);
            return $scope.designPrice;
        };

        $scope.nextDisable = function(){
            var currElement = $scope.mySelectedItems[$scope.designLevel];
            var $startmsg = "";
            if(currElement && currElement.bottompoints == 0){
                return true;
            }
            else if(!$scope.levelFilled)  {
                return true;
            }
            else if($scope.designLevel == 3){
                return true;
            }
            else return false;
        };

        $scope.processForm = function() {
          if($scope.productAdded) {
             return;
          }
          var payload = {
                        custom_product : $scope.mySelectedItems,
                        product_price : $scope.designPrice
                        };

          $http({
          method  : 'POST',
          url     : $scope.siteUrl+'php/ajax.php?addcustom',
          data    : payload  // pass in data as strings
         })
          .success(function(data) {
            if(data == "SUCCESS"){
                  $scope.productAdded = true;
                if(!$scope.isAgent){
                    $window.cart.getCart();
                     $('div.cart-box').slideDown('slow').delay(2000).slideUp('slow');
                }
                // else {
                //      $window.location = $scope.siteUrl+"admin/dashboard.php?custom";
                // }
            }
            else
                alert("insert into database failed");
          });
        };

        $scope.resetDesign = function(){
                $scope.mySelectedItems = [];
                $scope.designLevel = 0;
                $scope.currentPage = 0;
                $scope.levelFilled = false;
                $scope.prdIndex = [];
                $scope.allConnArr =[];
                $scope.designerPicks=[];
                $scope.designPrice=0;
                $scope.productAdded = false;

                $scope.filteredSet = findConnectionElements($scope.designObj.Earrings);
        };

        $scope.confirmDesign = function() {
            var yes= false;
            if( $scope.mySelectedItems.length > 0 && !$scope.productAdded ) yes = true;
            if( yes && $scope.designLevel == 0 && $scope.mySelectedItems[$scope.designLevel]) {
                 if($scope.mySelectedItems[$scope.designLevel].admintags.indexOf('hooks') < 0 ) yes = true;
                 else yes= false;
            }
            return yes;
        }

        $scope.gobackLevel = function() {
            if($scope.prdIndex[$scope.designLevel]){
                var indexToRemove = $scope.prdIndex[$scope.designLevel][0];
                var numberToRemove = $scope.prdIndex[$scope.designLevel].length;
                $scope.mySelectedItems.splice(indexToRemove, numberToRemove);
            }
            $scope.prdIndex.splice($scope.designLevel, 1);
            $scope.allConnArr.splice($scope.designLevel, 1);

            $scope.designLevel--;
            $scope.levelFilled = true;
             if($scope.designLevel ==0 && $scope.mySelectedItems[$scope.designLevel].admintags.indexOf('hook') > -1)
                $scope.showCartbtn = false;
            $scope.filteredSet = findConnectionElements($scope.designObj.Earrings);
        }


    }
]);

/*

offset = topimg_botconnpont.x - curimg_topconnpt.x
*/
des.directive('prdPosition', function($timeout) {
    return {
        restrict: "AE",
        scope: {
            selectedItem: '='
        },
        link: function(scope, element, $attrs) {
            var curElem = element;
            var thisScope = scope;
            scope.$watch('selectedItem.selectedImage', function(newVal, oldVal){
             $(curElem).css("left", thisScope.selectedItem.leftPos+"px");
             $(curElem).css("top", thisScope.selectedItem.topPos+"px");
            }, true);

        }
    };
});

des.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
}
});


des.filter('category', function() {
  return function(inputArr, catType) {
    inputArr = inputArr || [];
    var out = [];
    for (var i = 0; i < inputArr.length; i++) {
      if(inputArr[i].material == catType)
        out.push(inputArr[i]);
    }
    return out;
  };
})


des.directive('resizable', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      // do width check here, especially since you have $window object here already
      if($window.innerWidth <= 375)
          $scope.numDisp = 2;
      else if($window.innerWidth >= 376 && $window.innerWidth <= 480)
          $scope.numDisp = 3; //
      else if($window.innerWidth >= 481 && $window.innerWidth <= 736)
          $scope.numDisp = 5;
      else if($window.innerWidth > 736 && $window.innerWidth <= 1024)
          $scope.numDisp = 4;
      else if($window.innerWidth > 1024 && $window.innerWidth <= 1080)
          $scope.numDisp = 5;
      else if($window.innerWidth > 1080)
          $scope.numDisp = 8;

     // console.log($window.innerWidth, $scope.numDisp); // check console for right output

      return $scope.windowWidth = $window.innerWidth;
    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      return $scope.$apply();
    });
  };
});

des.factory('elementFactory', function() {
    var factory = {};
    return factory;
});


function openOverlay(num) {
    var lightDiv, fadeDiv;
    if(num == 0){
        lightDiv = "#light";
        fadeDiv = "#fade";
    }
    else if(num == 1){
        lightDiv = "#light1";
        fadeDiv = "#fade1";
    }
    else if(num == 2) {
        lightDiv = "#light2";
        fadeDiv = "#fade2";
    }

    $(lightDiv).show();
    $(fadeDiv).show();
    $('.lightboxClose').show();
}