var localuserid = localStorage.getItem('userid')
var localusername = localStorage.getItem('user')

hungryApp.controller('loginCtrl', function($scope, HungryFactory, $location){
	$scope.login = function() {
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
		var loginDetails = {
			username: username,
			password: password
		}
		console.log(loginDetails)

		HungryFactory.loginUser(loginDetails).success(function(success) {
			//console.log(success)

			localStorage.setItem("sessionToken", success.sessionToken);
			localStorage.setItem("user", success.username);
			localStorage.setItem("objectId", success.objectId);
			var getParams = {
				where: {
					username: localStorage.getItem("user")
				}
			}
		}).error(function(error) {
			console.log(error)
		})
}
}).controller('homeCtrl', function($stateParams, $scope, $location, $state){
	  localStorage.setItem("controller", 'home')

	$scope.appTitle = "What Are You Feeling?"
	$scope.foodtypes = ['italian', 'chinese', 'mexican', 'japanese', 'thai', 'burgers', 'pizza', 'vegan', 'turkish'];
	$scope.findFood = function($event){
		var foodType = angular.element(event.currentTarget).find('h4').html();
		console.log(foodType)
		$location.path('/tab/search/' + foodType)
	} 
}).controller('MainCtrl', function($state) {
  this.onTabSelected = function(_scope){
    if ( _scope.title === 'Home') {
    		localStorage.setItem('view', 'search')
    } 
     if ( _scope.title === 'Forks') {
    		localStorage.setItem('view', 'mentions')
    }   
     if ( _scope.title === 'MyProfile') {
    		localStorage.setItem('view', 'user')
    } 

}


}).controller('usertabCtrl', function($scope, $stateParams){
	$scope.username = localStorage.getItem('user')

}).controller('mentionsCtrl', function($scope, $stateParams, HungryFactory, $http){ 
	$scope.placeFilteringIgnored = false;

$scope.togglePlaceFiltering = function() {
    $scope.placeFilteringIgnored = !$scope.placeFilteringIgnored;
}
	  localStorage.setItem("controller", 'mentions')
	$scope.localUser = localStorage.getItem('user');

// navigator
navfunction($http, $scope, HungryFactory);

	//pull refresh
		$scope.doRefresh = function() {

		HungryFactory.getMentions(latMinus, latPlus, lngMinus, lngPlus).success(function(success) {
				console.log(success)
				if (success.length === 0) {
					$scope.nomentions = "none"
						//alert("no forks yet!")
				} else {
					$scope.nomentions = "exist"
					$scope.mentions = success;
					$scope.mentionid = success[0].id;

				}
			}).error(function(error) {
				console.log(error)
			}).finally(function() {
				// Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			});
		}


}).controller('hashCtrl', function($scope, HungryFactory, $stateParams){ 
	  localStorage.setItem("controller", 'hash')
            $scope.appTitle = '#' + $stateParams.hashName;
		//alert($stateParams.hashName)
			$scope.localUser = localStorage.getItem('user');
			

			HungryFactory.getMentionsByHashTag($stateParams.hashName).success(function(success){
				console.log(success)
				$scope.mentions = success;
			}).error(function(error){
				console.log(error)
			})	
	$scope.doRefresh = function() {
		HungryFactory.getMentions({
			where: {
				"hashtags": $stateParams.hashName
			}
		}).success(function(success) {
			console.log(success)
			$scope.mentions = success.results;
		}).error(function(error) {
			console.log(error)
		}).finally(function() {
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		});
	}


}).controller('placeCtrl', function($scope, $stateParams, HungryFactory, $ionicModal, $timeout, $cordovaGeolocation){
	    localStorage.setItem("controller", 'place')
		$scope.localUser = localStorage.getItem('user');
		$scope.appTitle = $stateParams.placename;
		$scope.addedsuccess = "false";
        console.log($scope.appTitle)
		//var placeName = $stateParams.placeName;
		//var placeLat = $stateParams.latOfPlace;
		//var placeLng = $stateParams.lngOfPlace;				
				HungryFactory.getMentionsByPlace($stateParams.placeid).success(function(success) {
					console.log(success)
					if (success.length === 0){
					
						$scope.nomentions = 'none';
						$scope.mentionCount = 0;
								
								// get coordinates if no mentions exist of place
								HungryFactory.getPlace($stateParams.placeid).success(function(success){
									console.log(success)
					                $scope.placeLat = success.lat;
					                $scope.placeLng = success.lng;							
								}).error(function(){
									console.log(error)
								});

					} else{
					$scope.place = success;
					$scope.nomentions = 'exist';
					$scope.appTitle = success[0].placeinfo.placename;
					$scope.cityofplace = success[0].placeinfo.placecity;

					//console.log( $scope.appTitle)
			         $scope.placeLat = success[0].lat;
			         $scope.placeLng = success[0].lng;
			         $scope.mentionCount = success[0].placeinfo.mention_count;
			         $scope.favoriteCount = success[0].placeinfo.favorite_count;
					// if success get reputationss
					HungryFactory.getRep(localuserid).success(function(success) {
						console.log(success)

						var mentionrepped = document.getElementsByClassName('repbtn');
						var mentionliked = document.getElementsByClassName('likebtn');

						checkRepStatus(mentionrepped, success)

					}).error(function(error) {
						console.log(error)
					});
						




					}

				}).error(function(error) {
					console.log(error)
				});


									/*HungryFactory.getMentionsByPlace({
											where: {
												lat: parseFloat($stateParams.latOfPlace),
												lng: parseFloat($stateParams.lngOfPlace)
											},
											order: '-createdAt',
											include: 'mentions'
										}).success(function(success) {
											console.log(success)
											if (success.results.length === 0) {
												$scope.nomentions = "none"
													//alert("no forks yet!")
											} else {
													$scope.place = success.results;
													$scope.nomentions = 'exist'

											}
										}).error(function(error) {
											console.log(error)
										});	*/	
				



  $ionicModal.fromTemplateUrl('views/forkthis.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;

  });


  $scope.openModal = function() {
    $scope.modal.show();


  };


  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


  $scope.submitFork = function(){


/**** Check Input for Hashtags and insert into object ****/
var forktext = $('#forkthisinput').val();
var hashtagsArray = [];
var hashtagsonly = forktext.match(/#\S+/g);

		if (hashtagsonly === null) {

		} else {
			for (var i = 0; i < hashtagsonly.length; i++) {
				var thisTag = hashtagsonly[i].replace('#', '').replace(/\./g, '');
				hashtagsArray.push(thisTag)
			}
		}

var thisId =  localStorage.getItem('objectId');


var addMention = {
    "author": localuserid,
    "username": localusername,
    "placeid": $stateParams.placeid,
    "placecountid":$stateParams.placeid,
    "hashtags": hashtagsArray,
    "placemention": forktext,
    "lat": $scope.placeLat,
    "lng": $scope.placeLng

}


	HungryFactory.addMention(addMention).success(function(success){
		console.log(success)
		  $scope.modal.hide();
			//var addfriendbucket = document.getElementsByClassName('addfriendbucket')[0]
			//addfriendbucket.style.backgroundColor = "#0198C9"
			//$scope.showicon = 'hide'

	}).error(function(error){
		console.log(error)
	})



  }


//get Favorites
HungryFactory.getFavorites(localStorage.getItem('userid')).success(function(success){
	console.log(success)
console.log($stateParams.placeid)
	for (var i = 0; i < success.length; i++){
		console.log(success[i].placeid)
		if (success[i].placeid === parseInt($stateParams.placeid)){	

			$timeout(function(){
			     $scope.$apply(function(){
			            $scope.addedsuccess = "true";

			     });
			 },0);
						$('.adfav').addClass('active')
						$('.adfav').attr('data-favid', success[i].id)
						$('.adfav').find('i').addClass('activewhite')
		} else{
			$scope.addedsuccess = "false";
		}
	}
}).error(function(error){
	console.log(error)
});


// add to favorites
$scope.addToFavorites = function(){
	var thiselement = angular.element(event.currentTarget);

	thiselement.toggleClass('active')
	thiselement.children('i').toggleClass('activewhite');
	

	var addFavorite = {
		"userid": localStorage.getItem('userid'),
		"placename": $scope.appTitle,
		"placeid":$stateParams.placeid
	}

	var deleteFavorite = thiselement.attr('data-favid');

		if (thiselement.hasClass('active')) {
			HungryFactory.addFavorite(addFavorite).success(function(success) {
				console.log(success)
				thiselement.attr('data-favid', success.id)
					$scope.addedsuccess = "true";
			}).error(function(error) {
				console.log(error)
			});

		} else{
			$scope.addedsuccess = "false";
			HungryFactory.deleteFavorite(deleteFavorite).success(function(success) {
				console.log(success)
				thiselement.attr('data-favid', "")
			}).error(function(error) {
				console.log(error)
			});


		}


}



$scope.showLocation = function(){
	$('.location-wrapper').addClass('cardSlideIn');
	HungryFactory.getPlace($stateParams.placeid).success(function(success){
         console.log(success)
         var locLat =  Number(success.lat);
         var locLng = Number(success.lng);
console.log(locLat + ' '  + locLng)

var styles = [
  {
    stylers: [
      { hue: "#00ffe6" },
      { saturation: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];
 var map = new google.maps.Map(document.getElementById("location-map"), {
		zoom: 10,
		center: myLatLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: styles
	});


       var myLatLng = {lat: locLat, lng: locLng};

console.log(myLatLng)
		var forkIcon = {
		    url: "img/fork.svg", // url
		    scaledSize: new google.maps.Size(40, 40), // scaled size
		    origin: new google.maps.Point(0,0), // origin
		    anchor: new google.maps.Point(0, 0) // anchor
		};

        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: forkIcon
        });


 $cordovaGeolocation.getCurrentPosition().then(function(position){ 

		initialLocation = new google.maps.LatLng(locLat, locLng);
		 map.setCenter(initialLocation);


	});

	}).error(function(error){
          console.log(error)
	});
}


$scope.showPhotos = function(){
 var placePhotos = []
 var bucket = new AWS.S3({params: {Bucket: 'myapp'}});
var params = {
  Bucket: 'myapp', /* required */
  Delimiter: '/',
  EncodingType: 'url',
  Prefix: 'places/' + $stateParams.placeid + '/'
};
bucket.listObjects(params, function(err,data){
	   if (err){
	   	console.log(err)
	   } else{
	   	console.log(data)
     angular.forEach(data.Contents, function(item){
     	console.log(item)
     	 if (item.Size != 0){
     	 	  var p = {
     	 	  	photo: 'http://s3.amazonaws.com/myapp/' + item.Key
     	 	  }
     	 	 placePhotos.push(p)
     	 }
       
     })
     $timeout(function(){
         $scope.photosOfPlace = placePhotos;

     }, 100)
	   }
})

    $('.photos-wrapper').addClass('cardSlideIn');
    
 
	
	angular.forEach($scope.photosOfPlace, function(photo, i){
	var img = new Image();
	img.src = photo.photo;	
		img.onload = function() {
		var thisAspectRatio = getAspectRatio(this.width, this.height)
				if (thisAspectRatio === "16:9"){
				 // 16x9 leave as is
				} else if (thisAspectRatio === "4:3"){
				   angular.element('.photo-holder').eq(i).find('img').addClass('box-photo')
				}
		}
	})
}



$scope.closeLocationPane = function(){
	$('.card-wrapper').removeClass('cardSlideIn');

}

function getAspectRatio(width, height) {
    var ratio = width / height;
    return ( Math.abs( ratio - 4 / 3 ) < Math.abs( ratio - 16 / 9 ) ) ? '4:3' : '16:9';
}

}).controller('userCtrl', function($scope, $stateParams, HungryFactory, $location, $timeout){
	  localStorage.setItem("controller", 'user')
	$scope.appTitle = $stateParams.username
	$scope.showfavorites = 'false'
	$scope.showmentions = 'true'
	$scope.showlikes = 'false'



	//get user based on state url variable
	HungryFactory.getUsers($stateParams.username).success(function(success) {
		//console.log(success.results)
		$scope.users = success;
		console.log($scope.users[0])


		// get user reputation
		HungryFactory.getReputations($stateParams.username).success(function(success) {
			console.log(success)
			var lengthOf = success.length;
			var countValue = [];
			for (var i = 0; i < success.length; i++) {
				countValue.push(success[i].value)

			}

			var totalValue = eval(countValue.join('+'));
			var finalVal = totalValue / lengthOf;
			console.log(finalVal)


			//user titles				
			if (finalVal <= 100) {
				$scope.reputation = 'Connoisseur';
			}

			if (finalVal <= 75) {
				$scope.reputation = 'Insightful Expert';
			}

			if (finalVal <= 50) {
				$scope.reputation = 'Hungry Critic';
			}

			if (finalVal <= 25) {
				$scope.reputation = 'Hungry Rookie';
			}
			if (isNaN(finalVal) === true) {
				$scope.reputation = 'Hungry Rookie';
			}

			//get user activity
			var thisId = $('#idHolderUser').attr('data-userid');

			HungryFactory.getMentionsByUser($stateParams.username).success(function(success) {
				//console.log(success)
				$scope.forklength = success.length;
				var mentionLengthUser = success.length
				$scope.mentions = success;
						HungryFactory.getAllMentions().success(function(success) {
							console.log(success.length)
							var mentionLength = success.length;
							$scope.counts = 100 - mentionLengthUser/mentionLength * 100;
							addClass(angular.element('.myforks'));

					
						// if show favorites, show this view
											if (localStorage.getItem("showTab") === "favorites") {
												$timeout(function() {
													angular.element('.myfavs').triggerHandler('click');
												}, 0);
											}
						// if show forks, show this view
											else if (localStorage.getItem("showTab") === "forks") {
												$timeout(function() {
													angular.element('.myforks').triggerHandler('click');
												}, 0);
											}
						// if show likes, show this view
											else if (localStorage.getItem("showTab") === "likes") {
												$timeout(function() {
													angular.element('.mylikes').triggerHandler('click');
												}, 0);
											}
											else if (!localStorage.getItem("showTab")){
												localStorage.setItem("showTab", "forks");

											}

						}).error(function(error) {
							console.log(error)
						});

			}).error(function(error) {
				console.log(error)
			});

			console.log(angular.element('#idHolderUser').attr('data-username'))
var imageUser = $('#idHolderUser').attr('data-username')
var imageid = $('#idHolderUser').attr('data-userid')
new AWS.S3().getObject({Bucket: 'MyApp', Key: imageUser + imageid + 'profile'}).on('success', function(response) {
  console.log("Key was", response.request.params.Key);

$scope.userImage = 'https://s3.amazonaws.com/' + 'MyApp' + '/' + imageUser + imageid + 'profile' +'?v=2'


}).send();			
			HungryFactory.getFollowing(localStorage.getItem('user')).success(function(success) {
				console.log(success)

				$scope.showicon = 'true';

				if (success.length === 0){
				 if ($('#idHolderUser').attr('data-username') === localStorage.getItem('user')){
				 	//alert()
					$scope.editprofile = 'true'
					$scope.showicon = 'null';
				}else{
					$scope.editprofile = 'false'
					$scope.showicon = 'false';
				}


				} else{
					$scope.editprofile = 'true'
					$scope.showicon = 'null';
					}				

				for (var i = 0; i < success.length; i++) {
					console.log(success[i])
					if (success[i].friendswith.id === thisId) {
						//var addfriendbucket = document.getElementsByClassName('addfriendbucket')[0]
						//addfriendbucket.style.backgroundColor = "#0198C9"
						$scope.showicon = 'false';
						

					}





				}


			}).error(function(error) {
				console.log(error)
			});



		});


	}).error(function(error) {
		console.log(error)
	});



	$scope.addFriend = function() {

		var thisId = $('#idHolder').attr('data-userid');


		//create friend table
		// create friends table
		var createFriendTable = {
			where: {
				username: localStorage.getItem("user")
			} //localStorage.getItem("user")
		}


		HungryFactory.createFriendTable(createFriendTable).success(function(success) {
			console.log(success)
			localStorage.setItem("relationFriends", success.objectId)
				//$location.path('/home')

			var userId = success.objectId;

			var addrelationship = {
					"friends": {
						"__type": "Pointer",
						"className": "_User",
						"objectId": thisId
					},
					username: localStorage.getItem('user')
				}
				//add to friend table

			HungryFactory.addFriend(addrelationship, userId).success(function(success) {
				console.log(success)
					//var addfriendbucket = document.getElementsByClassName('addfriendbucket')[0]
					//addfriendbucket.style.backgroundColor = "#0198C9"
					//$scope.showicon = 'hide'

			}).error(function(error) {
				console.log(error)
			})

		})

	}
$scope.showFavorites = function($event){
	localStorage.setItem("showTab", "favorites");
	var thiselement = angular.element('.myfavs');
	removeClass(thiselement)
	addClass(thiselement)

		HungryFactory.getFavorites(localStorage.getItem('userid')).success(function(success){
			console.log(success)
			$scope.favoriteslength = success.length;
			$scope.favorites = success;
		}).error(function(error){
			console.log(error)
		});

	$scope.showfavorites = 'true'
	$scope.showlikes = 'false'
	$scope.showmentions = 'false'
}

$scope.showLikes = function(){
	localStorage.setItem("showTab", "likes");

	var thiselement = angular.element('.mylikes');
	var successArray = [];
	removeClass(thiselement)
	addClass(thiselement)

		HungryFactory.getRep(localStorage.getItem('userid')).success(function(success){
			for (var i = 0; i < success.length; i++){
				if (success[i].value === 100){
					successArray.push(success[i])
				}
			}
			$scope.likeslength = successArray.length;
			$scope.likes = success;
		}).error(function(error){
			console.log(error)
		});

	$scope.showlikes = 'true'
	$scope.showfavorites = 'false'
	$scope.showmentions = 'false'

}

$scope.showMentions = function($event){
	localStorage.setItem("showTab", "forks");

	var thiselement = angular.element('.myforks');
	removeClass(thiselement)
	addClass(thiselement)
	$scope.showfavorites = 'false'
	$scope.showmentions = 'true'
	$scope.showlikes = 'false'
}






}).controller('followersCtrl', function($scope, $stateParams, HungryFactory, $location){
	  localStorage.setItem("controller", 'followers')
$scope.profileview = "yes";
$scope.username = $stateParams.username
$scope.appTitle = "followers";
id = $('#idHolderUser').attr('data-userid');

				HungryFactory.getFollowers(id).success(function(success) {
					console.log(success)
					$scope.friends = success;


				}).error(function(error) {
					console.log(error)
				});

	$scope.openUser = function($event){

		var friend = angular.element(event.currentTarget).attr('data-user');
		$location.path('/tab/user/' + friend)
	}

	$scope.openMentionsuser = function($event){

		var friend = angular.element(event.currentTarget).attr('data-user');
		$location.path('/tab/mentionsuser/' + friend)
	}


}).controller('followingCtrl', function($scope, $stateParams, HungryFactory, $location){
$scope.profileview = "no";
$scope.username = $stateParams.username
$scope.appTitle = "following";
				HungryFactory.getFollowing($stateParams.username).success(function(success) {
					console.log(success)
					$scope.friends = success;
					if (success.length <= 0){
						$scope.nofriends = "true"
						
					}


				}).error(function(error) {
					console.log(error)
				});

	$scope.openMentionsuser = function($event){

		var friend = angular.element(event.currentTarget).attr('data-user');
		$location.path('/tab/mentionsuser/' + friend)
	}




}).controller('searchCtrl', function($scope, $stateParams, HungryFactory, $timeout, $cordovaGeolocation, $location){
	  localStorage.setItem("controller", 'search')

$scope.appTitle = $stateParams.foodName;


var styles = [
  {
    stylers: [
      { hue: "#00ffe6" },
      { saturation: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

 $scope.map = new google.maps.Map(document.getElementById("search-map"), {
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: styles
	});

	var markers = [];
	var yelpReady = [];
 	$scope.businesses = [];
	var searchthis = $stateParams.foodName + ' Restaurant';
 $cordovaGeolocation.getCurrentPosition().then(function(position){ 

  google.maps.event.trigger( $scope.map, 'resize' );

		initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		 $scope.map.setCenter(initialLocation);
			getResults();

		google.maps.event.addListener( $scope.map, 'dragend', function() {

			getResults();

		});

	});



function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}


var yelpResults = function() {
   
      for (var i = 0; i < 20; i++) {
         $scope.map.infoWindow = new google.maps.InfoWindow();

        var datYelp = $scope.businesses[0][i];
        //console.log(datYelp);
      if (datYelp === undefined){
      } else{
        var position  = new google.maps.LatLng(datYelp.location.coordinate.latitude, datYelp.location.coordinate.longitude)
        var nameYelp = datYelp.name
        	 var street = datYelp.location.address[0];
        	 var city =  datYelp.location.city;
        	 var state = datYelp.location.state_code;
        	 var zipcode = datYelp.location.postal_code;
        	 var rating = datYelp.rating;
        	 var ratImg = datYelp.rating_img_url;
        	 var displayPhone = datYelp.display_phone;

       }

		var forkIcon = {
		    url: "img/fork.svg", // url
		    scaledSize: new google.maps.Size(40, 40), // scaled size
		    origin: new google.maps.Point(0,0), // origin
		    anchor: new google.maps.Point(0, 0) // anchor
		};

        var marker = new google.maps.Marker({
          position: position,
          name: nameYelp,
          street:street,
          city: city,
          state: state,
          zipcode: zipcode,
          ratImg: ratImg,
          displayPhone: displayPhone,
          from: "yelp",
          icon: forkIcon
        });
        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function(evt) {

						$scope.nameofplace = decodeURIComponent(this.name); 
						//console.log($scope.nameofplace)
						$scope.streetofplace = this.street;
						$scope.cityofplace = this.city;
						$scope.stateofplace = this.state;
						$scope.phoneofplace = this.displayPhone;
						$scope.zipofplace = this.zipcode;
						$scope.latofplace = this.getPosition().lat();
						$scope.lngofplace = this.getPosition().lng();
					    $scope.$apply()

									
         // alert($scope.nameofplace )

         


			//document.getElementById('singlePlace').className = "";
		document.getElementById('singlePlace').className += " slideLeft";
		//angular.element('#singlePlace').empty();      
			var closebtn = document.getElementById('closeBtn');
			closebtn.addEventListener('click', function() {
			$('#singlePlace').removeClass('slideLeft');});



        });

      }

	}


		function getResults(){
			var latLocation =  $scope.map.getCenter().lat()
			var longLocation =  $scope.map.getCenter().lng()
			//console.log(latLocationnew)

			HungryFactory.getItems(searchthis, latLocation, longLocation ).success(function(data) {
			//console.log(data)
			$scope.businesses = []
			$scope.businesses.push(data.businesses);
			yelpResults();
			setInterval(function() {
				if (markers.length === 20) {
					var markerCluster = '';

					markerCluster = new MarkerClusterer( $scope.map, markers);
					markerCluster.setMaxZoom(1);
					markerCluster.setGridSize(1);
					console.log(markers)
					markers = [];
					
				}
			}, 30)


		});
		}



$scope.searchPlace = function($event){
		  var placeName = angular.element(event.currentTarget).text();
		  var placeCity = angular.element(event.currentTarget).parent().find('.city').text();	
		  console.log(placeCity)
			var latPlus = $scope.latofplace + 2;
			var latMinus = $scope.latofplace - 2;

			var lngPlus = $scope.lngofplace + 2;
			var lngMinus = $scope.lngofplace - 2;

	HungryFactory.checkForPlace(placeName, latMinus, latPlus, lngMinus, lngPlus).success(function(success){
		//console.log(success)


if (success.length >= 1){
	console.log(success)
	var placeid = success[0].id;
	var placename = success[0].placename;
	var placeLat = success[0].lat;
	var placeLng = success[0].lng;
$location.path('/tab/searchplace/' + placename + '/' + placeid+ '/' + placeLat + '/' + placeLng);
}else{
	var place = {
		placename: placeName,
		lat: $scope.latofplace,
		lng: $scope.lngofplace,
		placecity: placeCity
	}

	console.log(place)
	HungryFactory.createPlace(place).success(function(success){
		console.log(success)
	var placeid = success.id;
	var placename = success.placename;
	var placeLat = success.lat;
	var placeLng = success.lng;
$location.path('/tab/searchplace/' + placename + '/' + placeid+ '/' + placeLat + '/' + placeLng);
	}).error(function(error){
		console.log(error)
	})


}

	}).error(function(error){
		console.log(error)
	})	 


}

});











//function to get zip 
function getGreaterThan(ziptoUse){
	//console.log(ziptoUse)
	  if (ziptoUse.charAt(0) === "0"){
	  	var zip =  parseInt(ziptoUse)+20;
	  	 var newziptoUse = "0" + zip;
	  	 //console.log(newziptoUse)
	  	 return newziptoUse
	  } else{

		var newziptoUse = parseInt(ziptoUse)+20;
		return newziptoUse
	  }

}


function getLessThan(ziptoUse){
	//console.log(ziptoUse)
	  if (ziptoUse.charAt(0) === "0"){
	  	var zip =  parseInt(ziptoUse)-20;
	  	 var newziptoUse = "0" + zip;
	  	 //console.log(newziptoUse)
	  	 return newziptoUse
	  } else{

		var newziptoUse = parseInt(ziptoUse)-20;
		return newziptoUse
	  }

}


function addClass(thiselement){
	thiselement.addClass('active')
	thiselement.children('i').addClass('activewhite');
	thiselement.children('span').addClass('activewhitesubtitle');
	thiselement.children('span').removeClass('subtitle');	
}

function removeClass(thiselement){
	angular.element('.active').removeClass('active')
	angular.element('.activewhitesubtitle').removeClass('activewhitesubtitle')
	angular.element('.activewhite').removeClass('activewhite')

}



//check Reputation liked or not for Mention view
function checkRepStatus(mentionrepped, success){

		for (var i=0; i < mentionrepped.length; i++){
			var thismentiondid = parseInt(mentionrepped[i].getAttribute('data-mentionid'))

				for (var n=0; n < success.length; n++){
					var checkmention = success[n].mention.id;

					var checkmentionvalue = success[n].value;


					if (thismentiondid === checkmention && checkmentionvalue === 100 && mentionrepped[i].hasAttribute('like-fork')){
						mentionrepped[i].className += ' activeicon'
						mentionrepped[i].className += ' staractive'
					} else if (thismentiondid === checkmention && checkmentionvalue === 0 && mentionrepped[i].hasAttribute('unlike-fork')){
						mentionrepped[i].className += ' activeicon'
						mentionrepped[i].className += ' staractive'

					}
					if (thismentiondid === checkmention ){
						mentionrepped[i].setAttribute('data-reputationid', success[n].id)
					} 



				}

			}
	
}

function navfunction($http, $scope, HungryFactory) {
	navigator.geolocation.getCurrentPosition(function(position) {

		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var zipArray = [];
		var geoArray = [];

		//get geolocation
		$http({
			method: 'GET',
			url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=false'
		}).success(function(success) {
			// get neighborhood or city

			for (var i = 0; i < success.results[0].address_components.length; i++) {
				if (success.results[0].address_components[i].types[0] === "neighborhood") {
					$scope.appTitle = success.results[0].address_components[i].long_name
					break;
				}

				if (success.results[0].address_components[i].types[0] === "sublocality") {
					$scope.appTitle = success.results[0].address_components[i].long_name
					break;
				}

				if (success.results[0].address_components[i].types[1] === "sublocality") {
					$scope.appTitle = success.results[0].address_components[i].long_name
					break;
				}
				if (success.results[0].address_components[i].types[0] === "locality") {
					$scope.appTitle = success.results[0].address_components[i].long_name
					break;
				}

			}

			var latToUse = success.results[0].geometry.location.lat;
			var longToUse = success.results[0].geometry.location.lng;
			//store zip in array
			var geoObject = {
				lat: latToUse,
				lng: longToUse
			}
			geoArray.push(geoObject)	
			var latPlus = geoArray[0].lat + 10;
			var latMinus = geoArray[0].lat - 10;

			var lngPlus = geoArray[0].lng + 10;
			var lngMinus = geoArray[0].lng - 10

			HungryFactory.getMentions(latMinus, latPlus, lngMinus, lngPlus).success(function(success) {
				if (success.length === 0) {
					$scope.nomentions = "none"
					angular.element('ion-spinner').addClass('hide-item');
				} else {
					angular.element('ion-spinner').addClass('hide-item');
					$scope.nomentions = "exist"
					$scope.mentions = success;
					// if success get reputationss
					HungryFactory.getRep(localuserid).success(function(success) {
						var mentionrepped = document.getElementsByClassName('repbtn');
						var mentionliked = document.getElementsByClassName('likebtn');

						checkRepStatus(mentionrepped, success)

					}).error(function(error) {
						console.log(error)
					});
				}
			}).error(function(error) {
				console.log(error)
			});


		})


	});
}