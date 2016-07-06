    AWS.config.update({
        accessKeyId : 'KEY',
        secretAccessKey : 'ID'
    });
    
    AWS.config.region = 'us-east-1';

var authorname = localStorage.getItem('user');
localStorage.setItem('user', 'greg');
localStorage.setItem('userid', '1');
// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var hungryApp = angular.module('hungryApp', ['ionic', 'ngCordova'])
.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
 
}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider
    .state('login', {
      url: '/login/',
      cache: true,
      templateUrl: 'views/login.html',
      controller: 'loginCtrl'
    })   
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "views/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      cache: true,
      views: {
        'home-tab': {
          templateUrl: "views/home.html",
          controller: 'homeCtrl'
        }
      }
    }) 
    .state('tabs.search', {
      url: "/search/:foodName",
      cache: true,
      views: {
        'home-tab': {
          templateUrl: "views/searchmap.html",
          controller: 'searchCtrl'
        }
      }
    })
    .state('tabs.searchplace', {
      url: "/searchplace/:placename/:placeid/:placeLat/:placeLng",
      cache: true,
      views:{
        'home-tab':{
      templateUrl: "views/place.html",
      controller: 'placeCtrl'
     }
    }
    }) 
    .state('tabs.searchhash', {
      url: '/searchhashtags/:hashName',
      cache: true,
      views:{
        'home-tab':{
          templateUrl: 'views/hashtags.html',
          controller: 'hashCtrl'
        }
      }
    })
    .state('tabs.searchuser', {
      url: '/searchuser/:username/:userid',
      cache: true,
      views:{
        'home-tab':{
          templateUrl: 'views/user.html',
          controller: 'userCtrl'
        }
      }
    })                                          
    .state('tabs.mentions', {
      url: "/mentions",
      cache: true,
      views: {
        'mentions-tab': {
          templateUrl: "views/mentions.html",
          controller: 'mentionsCtrl'
        }
      }
    })  
    .state('tabs.mentionshash', {
      url: '/mentionshashtags/:hashName',
      cache: true,
      views:{
        'mentions-tab':{
          templateUrl: 'views/hashtags.html',
          controller: 'hashCtrl'
        }
      }
    }) 
    .state('tabs.mentionsplace', {
      url: "/mentionsplace/:placename/:placeid",
      cache: false,
      views:{
        'mentions-tab':{
      templateUrl: "views/place.html",
      controller: 'placeCtrl'
     }
    }
    }) 
    .state('tabs.mentionsuser', {
      url: '/mentionsuser/:username/:userid',
      cache: true,
      views:{
        'mentions-tab':{
          templateUrl: 'views/user.html',
          controller: 'userCtrl'
        }
      }
    })  
    .state('tabs.mentionsfollowers', {
      url: '/mentionsfollowers/:username',
      cache: true,
      views:{
        'mentions-tab':{
          templateUrl: 'views/mentionsfollowers.html',
          controller: 'followersCtrl'
        }
      }
    }) 
    .state('tabs.mentionsfollowing', {
      url: '/mentionsfollowing/:username',
      cache: true,
      views:{
        'mentions-tab':{
          templateUrl: 'views/mentionsfollowing.html',
          controller: 'followingCtrl'
        }
      }
    })         
    .state('tabs.user', {
      url: '/user/:username/:userid',
      cache: true,
      views:{
        'user-tab':{
          templateUrl: 'views/user.html',
          controller: 'userCtrl'
        }
      }
    })   
    .state('tabs.userplace', {
      url: "/userplace/:placename/:placeid",
      cache: true,
      views:{
        'user-tab':{
      templateUrl: "views/place.html",
      controller: 'placeCtrl'
     }
    }
    })               
    .state('tabs.userhashtags', {
      url: '/userhashtags/:hashName',
      cache: true,
      views:{
        'user-tab':{
          templateUrl: 'views/hashtags.html',
          controller: 'hashCtrl'
        }
      }
    })               
    .state('tabs.userfollowers', {
      url: '/userfollowers/:username',
      cache: true,
      views:{
        'user-tab':{
          templateUrl: 'views/userfollowers.html',
          controller: 'followersCtrl'
        }
      }
    }) 
    .state('tabs.userfollowing', {
      url: '/userfollowing/:username',
      cache: true,
      views:{
        'user-tab':{
          templateUrl: 'views/userfollowing.html',
          controller: 'followingCtrl'
        }
      }
    }) 
    
    $urlRouterProvider.otherwise('/tab/home')

}).filter('fromTime', function () {
  return function (item) {
    return timeSince(item);
  };
});


hungryApp.filter('isMyprofile', function () {
  return function (item) {
  };
}).filter('getHash', function () {
  return function (hash){
    var viewFromLocal = localStorage.getItem('view');
    return hash.replace(/\./g,' ').replace(/#(\S*)/g,'<a href="#/tab/' +  viewFromLocal + 'hashtags/$1">#$1</a>');
  }
})/*.filter('getPlace', function($stateParams) {
  return function(place) {
    var locationUrl = window.location.href;
    var parts = locationUrl.split('/');
    var interestingPart = parts[5];
    var viewFromLocal = localStorage.getItem('view');
    var ctrlFromLocal = localStorage.getItem('controller')
    var showtabFromLocal = localStorage.getItem('showTab')

    switch (interestingPart) {
      case "mentions":
        return '<a href="#/tab/' + viewFromLocal + 'place/' + place.placeinfo.placename + '/' + place.placeid + '">' + '@' + place.placeinfo.placename + '</a>';
        break;

      case "mentionsplace":
        return '<a href="#/tab/' + viewFromLocal + 'place/' + $stateParams.placename + '/' + place.placeid + '">' + '@' + $stateParams.placename + '</a>';
        break;

      case "mentionshashtags":
      case "userhashtags":
        return '<a href="#/tab/' + viewFromLocal + 'place/' + place.placeinfo.placename + '/' + place.placeid + '">' + '@' + place.placeinfo.placename + '</a>';
        break;

      case "userplace":
        return '<a href="#/tab/' + viewFromLocal + 'place/' + $stateParams.placename + '/' + place.placeid + '">' + '@' + $stateParams.placename + '</a>';
        break;

      case "searchplace":
        return '<a href="#/tab/' + viewFromLocal + 'place/' + $stateParams.placename + '/' + place.placeid + '">' + '@' + $stateParams.placename + '</a>';
        break;
    }

    if (interestingPart === "user" && showtabFromLocal === "forks" || interestingPart === "mentionsuser" && showtabFromLocal === "forks" || interestingPart === "searchuser" && showtabFromLocal === "forks") {
      return '<a href="#/tab/' + viewFromLocal + 'place/' + place.placeinfo.placename + '/' + place.placeid + '">' + '@' + place.placeinfo.placename + '</a>';
   
    } 
    else if (interestingPart === "user" && showtabFromLocal === "favorites" || interestingPart === "mentionsuser" && showtabFromLocal === "favorites" || interestingPart === "searchuser" && showtabFromLocal === "favorites" ) {
      return '<a href="#/tab/' + viewFromLocal + 'place/' + place.placename + '/' + place.placeid + '">' + '@' + place.placename + '</a>';

    } 
    else if (interestingPart === "user" && showtabFromLocal === "likes" || interestingPart === "mentionsuser" && showtabFromLocal === "likes" || interestingPart === "searchuser" && showtabFromLocal === "likes") {
      return '<a href="#/tab/' + viewFromLocal + 'place/' + place.mention.placeinfo.placename + '/' + place.placeid + '">' + '@' + place.mention.placeinfo.placename + '</a>';
    }
  }

})*/.directive('placeDirective', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $elm, $attr) {
      $timeout(function() {
        var htmlToReplace = $elm.html().toString();
        $elm.parent().prepend('<h3>' + htmlToReplace + '</h3>')

        $elm.parent().find('h3').eq(1).remove();

      }, 0)
    }

  }

}]).filter('parseThis', function () {
  return function (item) {
    //console.log(item)
    var array = [];
    for (var i = 0; i < item.length; i++){
        array.push ('#' + item[i] + ' ');
    }
    //
    return array.join("").toString();
  };
}).directive('likeFork', function(HungryFactory){
    return{
        restrict: 'A',
        link: function($scope, elm, attr){

          elm.click(function(){
            var sibling = elm.siblings()
             var mentionid = elm.attr('data-mentionid');
             var placeid = elm.attr('data-placeid');
             var reputationid = elm.attr('data-reputationid');
             // first check if sibling is active and if active, delete
            if (sibling.hasClass('activeicon')){
                deleteRep(reputationid, HungryFactory, $scope)
                sibling.toggleClass('activeicon')
                sibling.toggleClass('staractive')
                 elm.toggleClass('activeicon')
                 elm.toggleClass('staractive')
                 postRep(100, mentionid, placeid, HungryFactory, $scope);
                 return false;
            }
            //if sibling is NOT active
            else{
            elm.toggleClass('activeicon')
            elm.toggleClass('staractive')

              //if active , post rep
              if(elm.hasClass('activeicon')){
                console.log('post')
                postRep(100, mentionid, placeid, HungryFactory, $scope);

              } else if (!elm.hasClass('activeicon')){
                deleteRep(reputationid, HungryFactory, $scope)
              }
            }

           })

        }

    }

}).directive('unlikeFork', function(HungryFactory){
    return{
        restrict: 'A',
        link: function($scope, elm, attr){

          elm.click(function(){
            var sibling = elm.siblings()
             var mentionid = elm.attr('data-mentionid');
             var placeid = elm.attr('data-placeid');
             var reputationid = elm.attr('data-reputationid');
             console.log(sibling)
             // first check if sibling is active and if active, delete
            if (sibling.hasClass('activeicon')){
                deleteRep(reputationid, HungryFactory, $scope)
                sibling.toggleClass('activeicon')
                sibling.toggleClass('staractive')
                 elm.toggleClass('activeicon')
                 elm.toggleClass('staractive')
                postRep(0, mentionid, placeid, HungryFactory, $scope);
                 return false;

            }
            //if sibling is NOT active
            else{
            elm.toggleClass('activeicon')
            elm.toggleClass('staractive')

              //if active , post rep
              if(elm.hasClass('activeicon')){
                console.log("s1")
                postRep(0, mentionid, placeid, HungryFactory, $scope);

              } else if (!elm.hasClass('activeicon')){
                deleteRep(reputationid, HungryFactory, $scope)
              }
            }

           })

        }

    }

}).directive('favoriteThis', function(HungryFactory){

  return{
    restrict: 'A',
    link: function($scope,elm,attr){
      elm.click(function(){
        var mentiontoLike = elm.attr('data-mentionid');

        var likeobject = {
                  author: parseInt(localStorage.getItem('userid')),
                  mentionliked: parseInt(mentiontoLike),
                  username:  localStorage.getItem('user'),

                  
                } 
                // post like
                HungryFactory.postLike(likeobject).success(function(success){
                      console.log(success)
                      $scope.repid = success.id;
                      console.log($scope.repid)

                });       
      })
    }
  }

}).directive('placeLoc', ['$location', function($location){
  return{
      restrict: 'A',
      link: function($scope, elm, attr){
        elm.on('click', function(){
         p = attr["placename"];
        pid = attr["placeid"];  
        console.log(p + pid)
      // #/tab/' + viewFromLocal + 'place/' + place.mention.placeinfo.placename + '/' + place.placeid + '"
      l = localStorage.getItem("view");
       $scope.$apply(function(){
        $location.path('/tab/' + l + 'place/' + p + '/' + pid) 

       })
        })


      }
  }
}])


var timeSince = function(date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }

    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'day';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hour";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "minute";
                    } else {
                        interval = seconds;
                        intervalType = "second";
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }

    return interval + ' ' + intervalType;
};


function postRep(value, mentionid, placeid, HungryFactory, $scope){

                var usertorep = {
                  author: parseInt(localStorage.getItem('userid')),
                  placeid: placeid,
                  mentionid: parseInt(mentionid),
                  value: value,
                  authorname:  authorname,
                  
                }
               // post like
                HungryFactory.postRep(usertorep).success(function(success){
                      console.log(success)
                      $scope.reputationid = success.id;
                      console.log( $scope.reputationid)
                      //console.log( $scope.repid)

                }).error(function(error){
                  console.log(error)
                });

}

function deleteRep(reputationid, HungryFactory, $scope){

               // post like
                HungryFactory.deleteRep(reputationid).success(function(success){
                      //$scope.reputationid = success.id;
                      //console.log( $scope.reputationid)

                }).error(function(error){
                  console.log(error)
                });

}
