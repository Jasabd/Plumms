'use strict';
var des = angular.module('cdesign', ['ngScrollbars']);

 des.config(function($locationProvider) {
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });
    });


 des.config(function (ScrollBarsProvider) {
    // the following settings are defined for all scrollbars unless the
    // scrollbar has local scope configuration
    ScrollBarsProvider.defaults = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: true // enable scrolling buttons by default
        },
        scrollInertia: 400, // adjust however you want
        axis: 'y', // enable 2 axis scrollbars by default,
        theme: 'rounded-dark',
        autoHideScrollbar: true
    };
});

des.controller('MainController', ['$scope', '$rootScope', '$http', '$window', '$document', '$timeout', '$location', '$sce',
    function($scope, $rootScope, $http, $window, $document, $timeout, $location, $sce) {
        $scope.loaded = false;
      $timeout(function() { $scope.loaded = true; },1000);

        $scope.siteUrl = $window.model.siteUrl;
        $scope.earringPieces = [];
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
        $scope.styles=$window.model.styles;
        $scope.startType = $window.model.startStyle;
        $scope.showCartbtn = false;
        $scope.customizedEarrings = [];
        $scope.showPieces = false;


        $scope.config = {
            autoHideScrollbar: false,
            theme: 'rounded-dark',
            advanced:{
                updateOnContentResize: true
            },
            callbacks:{
                onUpdate:function(){
                   // console.log(this.mcs.top);
                  // console.log("Scrollbars updated");
                   scrollTo('first', 0, {
                                scrollInertia: 0
                            });
                }
            },
                // setHeight: 4,
                scrollInertia: 0
        };


      //   $scope.updateScrollbar = function ('scrollTo', 0);


        $scope.getCustom =  function() {
            $http.get($scope.siteUrl+'php/ajax.php?getCustom').
            success(function(data) {
                $scope.customizedEarrings = data.customizedEarrings;
            });
        };

        $scope.getCustom();

        var marginPercent =$window.model.margin;
        var taxPercent =$window.model.vat;
        var overheads =$window.model.overheads;
        var transPercent =$window.model.transaction;
        var shipcost = $window.model.shipping;
        $scope.earringPieces = $window.model.elements;

        var isOdd = function(num){
            return num % 2;
        };

        var round5x = function (x){
                return Math.ceil(x/5)*5;
        }

        var filterByID = function (obj) {
          if (obj.id !== undefined && typeof(obj.id) === 'number' && !isNaN(obj.id)) {
            return true;
          } else {
            invalidEntries++;
            return false;
          }
        };


        var organize = function(arrElm) {

            var resArr = arrElm;
           // var terra = findCategory(arrElm, 1);
         //   console.log(terra);

         setTimeout(function() {
            $scope.$apply(function() {
             $scope.showPieces = true;

            });
          }, 1000);
          return resArr;

        };



        var findEligibleElement = function(eitems, celem){
            var resArr = [];
            /*
             var prevXs = prevItem.botX.split(",");
            var currXs = row.topX.split(",");
            var matchingPoints =true;
            for(var i=0; i< prevBottomPoints && matchingPoints; i++){

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
            var prevBottomPoints = 0;
            var prevElemCount =0;

            if ($scope.designLevel != 0) {
                prevItem = $scope.mySelectedItems[$scope.designLevel - 1];
                prevBottomPoints = prevItem.bottompoints;
                prevElemCount = $scope.prdIndex[$scope.designLevel - 1].length;
            }

            //if it is not level 1 and if the previous element was a stud..or didnt have bottompoints then there is no more options.
            // we can show options if only there are bottom points on previous elements
            // the next button will not be available anyways.
            //this case should not happen
            if ($scope.designLevel != 0 && prevBottomPoints == 0) {
                return resArr;
            }

            $.each(eitems, function(ind, row) {
                if(row.availability == 'Unavailable') { //we donot show elements that are less than 2 in quantity.
                    return true;
                }
                if ($scope.designLevel == 0) {
                    //we are getting only studs.. these elements dont have toppoints
                   if (row.toppoints == 0) {
                        resArr.push(row);
                    }
                } else {
                    //for other levels find the options

                    //if the prev element bottom point is only one, the options will all have only one top point
                    if(prevBottomPoints == 1 && prevElemCount == 1 ){
                        // all single top point elements are good options here.
                         if(row.toppoints == 1) resArr.push(row);
                    }
                    else {
                        // if the prev  element has multiple bottom points, we need to figure out if the element with only one toppoint fits into the multiple bottom points
                        if(row.toppoints == 0 ) { // eliminates all level0 elements like studs and hooks
                            return true;
                        }
                        else if(row.toppoints == 1 && prevElemCount == 1 ) {
                            var botXs=  prevItem.botX.split(",");
                            var botYs=  prevItem.botY.split(",");
                            var curWidth = row.imgwidth;
                            var curHeight = row.imgheight;
                            var fits =true;

                            for(var i=0; i < botXs.length && fits; i++){
                                var  a = botXs[i+1] - botXs[i];
                                var b = botYs[i+1] - botYs[i];
                               // console.log(curWidth);
                               // console.log(Math.sqrt(a*a + b*b));
                                // if(Math.sqrt(a*a + b*b) <= (curWidth) || Math.sqrt(a*a + b*b) <= (curHeight)) {
                                if(Math.sqrt(a*a + b*b) <= curWidth) {
                                // if( a <= curWidth) {
                                   fits=false;
                                }
                            }
                            if(fits) resArr.push(row);
                        }
                        else if(row.toppoints == 1 && prevElemCount > 1 ) {
                            //previous element is probably attached to a multiple bottom point element or it is attached to elements that are attached to a multiple bottom point element.
                            // we need to find the nearest element that has the multiple bottom points
                            var leveltoCheck = $scope.designLevel - 1;
                            //since prevElemCount is > 1 we know we need to look at a level before this.
                            leveltoCheck--;
                            if(leveltoCheck >= 0 && $scope.prdIndex[leveltoCheck].length == 1) { // this is the element we are lookingn for.
                                var itemtoCheck = $scope.mySelectedItems[$scope.prdIndex[leveltoCheck][0]];
                                var botXs=  itemtoCheck.botX.split(",");
                                var botYs=  itemtoCheck.botY.split(",");
                                var curWidth = row.imgwidth;
                                var curHeight = row.imgheight;
                                var fits =true;

                                for(var i=0; i < botXs.length && fits; i++){
                                    var  a = botXs[i+1] - botXs[i];
                                    var b = botYs[i+1] - botYs[i];
                                   // console.log(curWidth);
                                   // console.log(Math.sqrt(a*a + b*b));
                                    // if(Math.sqrt(a*a + b*b) <= (curWidth) || Math.sqrt(a*a + b*b) <= (curHeight)) {
                                    if(Math.sqrt(a*a + b*b) <= curWidth) {
                                    // if( a <= curWidth) {
                                        fits=false;
                                    }
                            }
                            if(fits) resArr.push(row);
                            }
                            else {
                                //this should not happen
                            }
                        }
                        else if(row.toppoints == prevBottomPoints){
                            //if the element with multiple top point matches the multiple prev element bottom points
                            var prevXs = prevItem.botX.split(",");
                            var currXs = row.topX.split(",");
                            var matchingPoints =true;
                            for(var i=0; i< prevBottomPoints && matchingPoints; i++){
                                if(Math.abs((currXs[i+1] - currXs[i]) - (prevXs[i+1] - prevXs[i])) > 5)
                                    matchingPoints=false;
                            }
                            if(matchingPoints) resArr.push(row);
                        }
                        else {
                            return true;
                        }
                    }
                }

            });
            return organize(resArr);
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

        $scope.filteredSet =  findConnectionElements($scope.earringPieces);

        $scope.addImage = function(imItem) {
            var url = $scope.siteUrl+"productImages/"+imItem.selectedImage;
             return $sce.trustAsResourceUrl(url);
        };

        $scope.selectImage = function(elem, mainlist) {
            $scope.levelFilled = true;

            //for sparkling connection point
            $('figure.star.level'+$scope.designLevel).remove();

            var bpoints = ($scope.mySelectedItems.length ==0) ? 1 : 0;
            var tpoints = elem.toppoints;
            var indexToRemove = 0;
            var numberToRemove = 0;
            var prevElsArr=[];
            var numberOfElemInPrevLevel =0;
            var lastLevelEl = [];
            var fits = true;

             if(mainlist && $scope.designLevel ==0 && elem.style.indexOf('hook') > -1)
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

                // if ther eare multiple elements or multiple bottompoints in the previous level we need to update bpoints accordingly
                $.each(prevElsArr, function(ix, elPos){
                    bpoints += $scope.mySelectedItems[elPos].bottompoints;
                });

                var prevConnArrLength = $scope.allConnArr[$scope.designLevel-1].length;
                $.each($scope.allConnArr[$scope.designLevel-1], function(ix, elPos){
                    lastLevelEl.push($scope.mySelectedItems[elPos.split(',')[0]]);
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
                    for(var j=0; j< currBottomPoints; j++) {
                       connArr.push(pos+","+j);
                    }
                    indexArr.push(pos);

                    var element = {};
                    angular.copy(elem, element)
                    // if(element.style.indexOf('hook') > -1)
                    //     element.selectedImage = element.hookImg;
                    // else
                        element.selectedImage = element.carouselImg;

                    //Calculating topPos and leftPos
                    var topPos = 0;
                    var leftPos = 0;

                    if ($scope.designLevel != 0) {
                        var prevElement = null;
                        prevElement = lastLevelEl[i];
                        topPos += parseInt(prevElement.topPos, 10);
                        leftPos += parseInt(prevElement.leftPos, 10);
                        var connPoint = $scope.allConnArr[$scope.designLevel-1][i];

                        if(prevElement.bottompoints > 1){
                             var botPoints = prevElement.botY.split(",");
                             topPos += parseInt(botPoints[connPoint.split(",")[1]], 10);
                             var tPoints = prevElement.botX.split(",");
                                leftPos += parseInt(tPoints[connPoint.split(",")[1]], 10) - parseInt(element.topX, 10);
                        }
                        else {
                             topPos += parseInt(prevElement.botY, 10);
                             leftPos += parseInt(prevElement.botX, 10) - parseInt(element.topX, 10);
                        }
                    }
                    else {
                        leftPos += parseInt(element.centerx, 10);
                        topPos += parseInt(element.centery, 10);
                    }

                    // console.log(topPos);
                    // console.log(leftPos);

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

        var updateQuantity = function (flag, level) {
            var elemInd = $scope.prdIndex[level];
            var currEl = null;
            $.each(elemInd, function(indx, val){
                currEl = $scope.mySelectedItems[val];
                 angular.forEach($scope.earringPieces, function(epiece) {
                        if(epiece.id == currEl.id) {
                            var quant = parseInt(epiece.quantity, 10);
                            if(flag) epiece.quantity = quant-2;
                            else  epiece.quantity = quant+2;
                        }
                    });
            });
              console.log($scope.mySelectedItems);
        }
        $scope.updateLevel = function() {
            $scope.showPieces = false;

            if($scope.levelFilled) {
              //  updateQuantity(true, $scope.designLevel);
                $scope.designLevel++;
                $scope.levelFilled = false;
                $scope.filteredSet = findConnectionElements($scope.earringPieces);

            } else {
                alert("you havent selected elements for this level yet.");
            }

        };

        var designTotal = function(){
            var total = 0;
            var marginFactor = 1 + marginPercent/100;
            var taxFactor = 1 + taxPercent/100;
            var transactionFactor = 1 + transPercent/100;

            $.each($scope.mySelectedItems, function(indx, sitem){
                  total = total + parseFloat(sitem.price, 10);
            });

            // total  = (total + overheads) * marginFactor *taxFactor;
            total  = (transactionFactor*(shipcost + taxFactor*(marginFactor*(overheads+(total*2)))));
            // total = 300;
            $scope.designPrice = round5x(Math.round(total));
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
          $scope.designPrice = designTotal();
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
            if(data.result == "SUCCESS"){
                  $scope.customizedEarrings = data.customizedEarrings;
                //  $scope.resetDesign();

                  $("#myModal span#earringType").html($scope.startType);
                  $("#myModal .fb-share-button").attr('data-href', 'http://fitoori.com/productImages/'+data.pimg);
                  $("#myModal input[name='pid']").val(data.pid);
                  $("#myModal input[name='pprice']").val(data.pprice);
                  $("#myModal img#cimg").attr('src', '../productImages/'+data.pimg);
                  $("#myModal #pr_price").html(data.pprice);
                  $("#myModal #matlist").html(data.matlist);
                  $("#myModal").modal();
            }
            else
                alert("insert into database failed");
          });
        };

        $scope.resetDesign = function(){
                // the quantity is updated only for the case where currently a design session is in progress and not when save design was clicked.
                // if($scope.mySelectedItems.length > 0  && !$scope.productAdded) {
                //    if($scope.levelFilled) updateQuantity(false, $scope.designLevel);
                //    else updateQuantity(false, $scope.designLevel-1);
                // }

                $scope.mySelectedItems = [];
                $scope.designLevel = 0;
                $scope.currentPage = 0;
                $scope.levelFilled = false;
                $scope.prdIndex = [];
                $scope.allConnArr =[];
                $scope.designerPicks=[];
                $scope.designPrice=0;
                $scope.showCartbtn = false;

                $scope.earringPieces = $window.model.elements;
                $scope.filteredSet = findConnectionElements($scope.earringPieces);

        };


        $scope.addDesToCart = function(pid, pprice) {
             $("#myModal").modal('hide');
             window.cart.updateCart(pid, pprice);
             window.cart.openCloseCart();
             return false;
        }

        $scope.gobackLevel = function() {
             // if($scope.levelFilled) updateQuantity(false, $scope.designLevel);
             //       else updateQuantity(false, $scope.designLevel-1);

            if($scope.prdIndex[$scope.designLevel]){
                var indexToRemove = $scope.prdIndex[$scope.designLevel][0];
                var numberToRemove = $scope.prdIndex[$scope.designLevel].length;
                $scope.mySelectedItems.splice(indexToRemove, numberToRemove);
            }
            $scope.prdIndex.splice($scope.designLevel, 1);
            $scope.allConnArr.splice($scope.designLevel, 1);

            $scope.designLevel--;
            $scope.levelFilled = true;
             if($scope.designLevel ==0 && $scope.mySelectedItems[$scope.designLevel].style.indexOf('hook') > -1)
                $scope.showCartbtn = false;
            $scope.filteredSet = findConnectionElements($scope.earringPieces);
                designTotal();

        }

        $scope.getNumber = function(num) {
            return new Array(num);
        };

    }
]);

/*

offset = topimg_botconnpont.x - curimg_topconnpt.x
*/
des.directive('prdPosition', function($timeout) {
    return {
        restrict: "AE",
        scope: {
            selectedItem: '=',
            level: '='
        },
        link: function(scope, element, $attrs) {
            var curElem = element;
            var thisScope = scope;
            scope.$watch('selectedItem.selectedImage', function(newVal, oldVal){
             $(curElem).css("left", thisScope.selectedItem.leftPos+"px");
             $(curElem).css("top", thisScope.selectedItem.topPos+"px");
             $('figure.star').not('.level'+thisScope.level).remove();

             if(thisScope.level != 3) {
                 var bx = thisScope.selectedItem.botX.split(",");
                 var by = thisScope.selectedItem.botY.split(",");
                 for(var ix=0; ix < thisScope.selectedItem.bottompoints; ix++){
                    var starEl = $("<figure class='star level"+thisScope.level+"'><figure class='star-top'></figure><figure class='star-bottom'></figure></figure>");
                    var lp = bx[ix];
                    var tp = by[ix];
                    $(starEl).css("left", lp+"px");
                    $(starEl).css("top", by[ix]+"px");
                    $(starEl).appendTo(curElem);
                 }
             }

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



des.directive('zoom', function(){
    function link(scope, element, attrs){
      var $ = angular.element;
      var original = $(element[0].querySelector('.original'));
      var originalImg = original.find('img');
      var zoomed = $(element[0].querySelector('.zoomed'));
      var zoomedImg = zoomed.find('img');

      var mark = $('<div></div>')
        .addClass('mark')
        .css('position', 'absolute')
        .css('height', scope.markHeight +'px')
        .css('width', scope.markWidth +'px')

      $(element).append(mark);

      element
        .on('mouseenter', function(evt){
          mark.removeClass('hide');

          var offset = calculateOffset(evt);
          moveMark(offset.X, offset.Y);
        })
        .on('mouseleave', function(evt){
          mark.addClass('hide');
        })
        .on('mousemove', function(evt){
          var offset = calculateOffset(evt);
          moveMark(offset.X, offset.Y);
        });

      scope.$on('mark:moved', function(event, data){
        updateZoomed.apply(this, data);
      });

      function moveMark(offsetX, offsetY){
        var dx = scope.markWidth,
            dy = scope.markHeight,
            x = offsetX - dx/2,
            y = offsetY - dy/2;

        mark
          .css('left', x + 'px')
          .css('top',  y + 'px');

        scope.$broadcast('mark:moved', [
          x, y, dx, dy, originalImg[0].height, originalImg[0].width
        ]);
      }

      function updateZoomed(originalX, originalY, originalDx, originalDy, originalHeight, originalWidth){
        var zoomLvl = scope.zoomLvl;
        scope.$apply(function(){
          zoomed
            .css('height', zoomLvl*originalDy+'px')
            .css('width', zoomLvl*originalDx+'px');
          zoomedImg
            .attr('src', scope.src)
            .css('height', zoomLvl*originalHeight+'px')
            .css('width', zoomLvl*originalWidth+'px')
            .css('left',-zoomLvl*originalX +'px')
            .css('top',-zoomLvl*originalY +'px');
        });
      }

      var rect;
      function calculateOffset(mouseEvent){
        rect = rect || mouseEvent.target.getBoundingClientRect();
        var offsetX = mouseEvent.clientX - rect.left;
        var offsetY = mouseEvent.clientY - rect.top;

        return {
          X: offsetX,
          Y: offsetY
        }
      }

      attrs.$observe('ngSrc', function(data) {
        scope.src = attrs.ngSrc;
      }, true);


      attrs.$observe('zoomLvl', function(data) {
        scope.zoomLvl =  data;;
      }, true);
    }

    return {
      restrict: 'EA',
      scope: {
        markHeight: '@markHeight',
        markWidth: '@markWidth',
        src: '@src',
        zoomLvl: "@zoomLvl"
      },
      template: [
        '<div class="original">',
          '<img ng-src="{{src}}"/>',
        '</div>',
        '<div class="zoomed">',
          '<img/>',
        '</div>'
      ].join(''),
      link: link
    };
  });

des.factory('elementFactory', function() {
    var factory = {};
    return factory;
});





function addToCart() {
    var pid = $("#myModal input[name='pid']").val();
    var pprice = $("#myModal input[name='pprice']").val();
    $("#myModal").modal('hide');

     window.cart.updateCart(pid, pprice);
     window.cart.openCloseCart();
     return false;
}

function openfb() {
 var imgurl = $("#myModal img#cimg").attr("src");
 imgurl = imgurl.replace("..", "http://fitoori.com");
    FB.ui({
      method: 'share',
      href: "http://fitoori.com",
      name: "My Fitoori Design",
      picture: imgurl,
      description: "Designed on Fitoori.com!",
      app_id: 236903216763385
    }, function(response){
    if (response && !response.error_code) {
        console.log("OK: "+JSON.stringify(response));
    } else if (response && response.error_code === 4201) { //Cancelled
        console.log("User cancelled: "+decodeURIComponent(response.error_message));
    } else {
        console.log("Not OK: "+JSON.stringify(response));
    }
});

  // $('.js-share-facebook').on('click', function() {
  //   FB.ui({
  //       method: 'share_open_graph',
  //       action_type: 'og.shares',
  //       action_properties: JSON.stringify({
  //           object : {
  //              'og:url': BASE_URL,
  //              'og:title': galleryItem.title,
  //              'og:description': galleryItem.description,
  //              'og:og:image:width': '2560',
  //              'og:image:height': '960',
  //              'og:image': BASE_URL + '/images/works/galleries' + galleryItem.image
  //           }
  //       })
  //   });
  // });
}
