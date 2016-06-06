'use strict';
var des = angular.module('cdesign', []);

 des.config(function($locationProvider) {
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });
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
        $scope.productAdded = false;
        $scope.startType = $window.model.startStyle;
        $scope.showCartbtn = false;
        $scope.customizedEarrings = [];
        var nextMsg = true;
        var attMsg = true;
        var level1Msg = true;
        var level2Msg = true;
        var level3Msg = true;

        $scope.feedbackMsg = '';

        switch($scope.startType) {
            case 'stud':
                $scope.feedbackMsg = 'Explore our range of studs , dont forget to click + and see all options.';
                break;
            case 'jhumka' :
                $scope.feedbackMsg = 'Choose a top or hook for your jhumka to add here.';
                break;
            case 'hoop' :
                $scope.feedbackMsg = 'Start by choosing a hoop to add here.';
                break;
            case 'chandelier' :
                $scope.feedbackMsg = 'Start by choosing a hook or top for you chandelier to add here.';
                break;
            case 'dangler' :
                $scope.feedbackMsg = 'Start by choosing a hook or top for you dangler to add here.';
                break;
        };

        $scope.showMsg = true;

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

        $scope.earringPieces = $window.model.elements;

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
                if(row.quantity < 2) { //we donot show elements that are less than 2 in quantity.
                    return true;
                }
                if ($scope.designLevel == 0) {
                    // if (row.toppoints == 0 && row.admintags.indexOf($scope.startType)) {
                   if (row.toppoints == 0) {
                        resArr.push(row);
                    }
                } else {
                    if(row.toppoints == 1){
                        // if($scope.designLevel == 3){
                        //     if(row.bottompoints == 0)
                        //         resArr.push(row);
                        // }
                        // else
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

        $scope.filteredSet =  findConnectionElements($scope.earringPieces);

        $scope.addImage = function(imItem) {
            var url = $scope.siteUrl+"productImages/"+imItem.selectedImage;
             return $sce.trustAsResourceUrl(url);
        };

        $scope.selectImage = function(elem, mainlist) {
            $scope.levelFilled = true;

            if(nextMsg) {
                $scope.feedbackMsg = "Click 'Next' to add a " +$scope.startType+" design.";
                $(".curvedarrow").hide();
                $(".curvedarrowDown").show();
                $scope.showHelp();
                nextMsg = false;
            }
            else if(elem.bottompoints == 0 && attMsg){
                $scope.feedbackMsg = "Looks great! The \"Next\" button won't appear when no further attachments can be made. Save your  personalized "+$scope.startType+ "! ";
                $scope.showHelp();
                $(".curvedarrowLeft").hide();
                $(".curvedarrowLeft").hide();
                $(".curvedarrow").show();
                attMsg = false;

            }


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
                           console.log(curWidth);
                           console.log(Math.sqrt(a*a + b*b));

                            if(Math.sqrt(a*a + b*b) <= (curWidth+10)) {
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
          //   $('.white_content').hide(); $('.black_overlay').hide(); $('.lightboxClose').hide();
        };

        $scope.updateLevel = function() {
            if($scope.levelFilled) {
                $scope.designLevel++;
                $scope.levelFilled = false;
                $scope.filteredSet = findConnectionElements($scope.earringPieces);
                $('.white_content').hide(); $('.black_overlay').hide(); $('.lightboxClose').hide();

                $scope.feedbackMsg = '';
                $(".curvedarrowDown").hide();
                $(".curvedarrow").hide();
                if($scope.designLevel == 1 && level1Msg) {
                            $scope.feedbackMsg = "Wonderful! Now choose a design from our collection for your "+$scope.startType+", click + to see all options. Add to cart if you like your design.";
                            $(".curvedarrowLeft").show();
                            level1Msg = false;


                    //  switch($scope.startType) {
                    //     case 'jhumka' :
                    //         $scope.feedbackMsg = 'Wonderful! Now choose a design from our collection to add below your jhumka.';
                    //         break;
                    //     case 'hoop' :
                    //         $scope.feedbackMsg = 'Wonderful! Now choose a design from our collection to match below your hoop.';
                    //         break;
                    //     case 'chandelier' :
                    //         $scope.feedbackMsg = "Wonderful! Now choose a design from our collection, don't forget to click + and see all options.";
                    //         break;
                    //     case 'dangler' :
                    //         $scope.feedbackMsg = "Wonderful! Now choose a design from our collection, don't forget to click + and see all options. Add to cart if you like your design.";
                    //         break;
                    // };
                }
                else if($scope.designLevel == 2 && level2Msg) {
                            $(".curvedarrowLeft").show();
                    $scope.feedbackMsg = "Would you like to decorate it more? Go on choose another design. Add to cart if you like your design.";
                    level2Msg = false;
                }
                else if($scope.designLevel == 3 && level3Msg) {
                            $(".curvedarrowLeft").show();
                    $scope.feedbackMsg = "Good going! Pick what you like from our collection one final time if you want to add more.";
                    level3Msg = false;
                }
                $scope.showHelp();

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

        $scope.showHelp = function(classname) {
            // if(!classname) classname= ".bubble";
            // $(classname).removeClass("fadeOutLeft");
            // setTimeout(function(){
            //   $(classname).addClass("fadeOutLeft");
            // }, 2000);
            if($scope.feedbackMsg != '')
                $(".message").show();
        }

        $scope.processForm = function() {
          if($scope.productAdded) {
             return;
          }
          $scope.showMsg = false;
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
                  $scope.productAdded = true;
                  $scope.customizedEarrings = data.customizedEarrings;
                  $scope.earringPieces = data.newpieces;
                  $scope.resetDesign();

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
                $scope.mySelectedItems = [];
                $scope.designLevel = 0;
                $scope.currentPage = 0;
                $scope.levelFilled = false;
                $scope.prdIndex = [];
                $scope.allConnArr =[];
                $scope.designerPicks=[];
                $scope.designPrice=0;
                $scope.productAdded = false;
                $scope.showCartbtn = false;

                $scope.filteredSet = findConnectionElements($scope.earringPieces);
             $('.white_content').hide(); $('.black_overlay').hide(); $('.lightboxClose').hide();

        };

        $scope.confirmDesign = function() {
            var yes= false;
            if( $scope.mySelectedItems.length > 0 && !$scope.productAdded ) yes = true;
            if( yes && $scope.designLevel == 0 && $scope.mySelectedItems[$scope.designLevel]) {
                 if($scope.mySelectedItems[$scope.designLevel].style.indexOf('hooks') < 0 ) yes = true;
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
             if($scope.designLevel ==0 && $scope.mySelectedItems[$scope.designLevel].style.indexOf('hook') > -1)
                $scope.showCartbtn = false;
            $scope.filteredSet = findConnectionElements($scope.earringPieces);
                designTotal();

        }

        $scope.getNumber = function(num) {
            return new Array(num);
        };

        $scope.closeMsg = function(){
            $(".message").hide();
            return;
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

function addToCart() {
    var pid = $("#myModal input[name='pid']").val();
    var pprice = $("#myModal input[name='pprice']").val();
     window.cart.updateCart(pid, pprice);
     $('div.cart-box').slideDown('slow').delay(1000).slideUp('slow');
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
      app_id: 1076977995697955
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
