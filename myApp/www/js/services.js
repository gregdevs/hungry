hungryApp.factory('HungryFactory', function($rootScope, $http){
  var HungryFactory = {};
  var urlBase =  'http://127.0.0.1:8000/';


//login




          
HungryFactory.getItems = function(searchthis, latLocation, longLocation) {

	var method = 'GET';
	var url = 'http://api.yelp.com/v2/search';
	var params = {
		callback: 'JSON_CALLBACK',
		ll: latLocation + ',' + longLocation, 
		oauth_consumer_key: 'XaMXvnBYzAgJ_DIVlYWkUg', //Consumer Key
		oauth_token: 'X8WUIn-_K1uGIJuLYA5JHpzBLVhEWlc3', //Token
		oauth_signature_method: "HMAC-SHA1",
		oauth_timestamp: new Date().getTime(),
		oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
		term: searchthis,
		category_filter: 'restaurants'
	};
	var consumerSecret = 'rUtcaYKAEGQZVH7XqvKW8WBUJ7I'; //Consumer Secret
	var tokenSecret = 'bPLsTjyRQQeAGOSj1NoRqEVLk-o'; //Token Secret
	var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {
		encodeSignature: false
	});
	params['oauth_signature'] = signature;
	
	/*return $http.jsonp(url,{
		params: params 
	})*/
 return  $.ajax({
  'url': url,
  'data': params,
  'cache': true,
  'dataType': 'jsonp',
  'success': function(data, textStats, XMLHttpRequest) {
    console.log(data);
    }
});
}

HungryFactory.getAllMentions = function(){
	return $http({
	method: 'GET',
	url: urlBase + 'mentions/',
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}



HungryFactory.getMentions = function(lat_minus, lat_plus, lng_minus, lng_plus){
	return $http({
	method: 'GET',
	url: urlBase + 'mentions/?ordering=-created_date&lat_minus=' + lat_minus + '&lat_plus=' + lat_plus + '&lng_minus=' + lng_minus + '&lng_plus=' + lng_plus,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}

HungryFactory.getMentionsByUser = function(username){
	return $http({
	method: 'GET',
	url: urlBase + 'mentions/?ordering=-created_date&username=' + username,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}

/*HungryFactory.getMentionsByPlace = function(placename, lat, lng){
	return $http({
	method: 'GET',
	url: urlBase + 'mentions/?ordering=-created_date&placename=' + placename + '&lat=' + lat + '&lng=' + lng,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}*/

HungryFactory.getMentionsByPlace = function(placeid){
	return $http({
	method: 'GET',
	url: urlBase + 'mentions/?ordering=-created_date&placeid=' + placeid,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}

HungryFactory.getMentionsByHashTag = function(hashtag){
	return $http({
	method: 'GET',
	url: urlBase + 'mentions/?ordering=-created_date&hashtags=' + hashtag,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}

HungryFactory.getReputations = function(username){
	return $http({
	method: 'GET',
	url: urlBase + 'reputations/?username=' + username,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}


HungryFactory.getUsers = function(username){
	return $http({
	method: 'GET',
	url: urlBase + 'users/?username=' + username,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}





HungryFactory.getFollowing = function(username){
	return $http({
	method: 'GET',
	url: urlBase + 'friends.json?username=' + username,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}


HungryFactory.getFollowers = function(userid){
	return $http({
	method: 'GET',
	url: urlBase + 'friends.json?friendswith=' + userid,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}








/*PLACE*/


HungryFactory.createPlace = function(place){
	return $http({
		method: 'POST',
		url: urlBase + 'places.json',
		data: place,
		headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
	})
}

HungryFactory.checkForPlace = function(placename, lat_minus, lat_plus, lng_minus, lng_plus){
	return $http({
	method: 'GET',
	url: urlBase + 'places/?ordering=-created_date&placename=' +  placename + '&lat_minus=' + lat_minus + '&lat_plus=' + lat_plus + '&lng_minus=' + lng_minus + '&lng_plus=' + lng_plus,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}

HungryFactory.getPlace = function(placeid){
	return $http({
	method: 'GET',
	url: urlBase + 'places/' +  placeid + '.json',
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}

/*favorites*/

HungryFactory.getFavorites = function(userid){
	return $http({
	method: 'GET',
	url: urlBase + 'favorites.json?userid=' + userid,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}


HungryFactory.addFavorite = function(addFavorite){
	return $http({
	method: 'POST',
	url: urlBase + 'favorites.json',
	data: addFavorite,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}

HungryFactory.deleteFavorite = function(deleteFavorite){
	return $http({
	method: 'DELETE',
	url: urlBase + 'favorites/' + deleteFavorite + '/',
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}


/*MENTIONS*/


HungryFactory.addMention = function(addMention){
	return $http({
	method: 'POST',
	url: urlBase + 'mentions.json',
	data: addMention,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}



/* REPUTATIONS */
//delete reputation
HungryFactory.deleteRep = function(unrep){
	return $http({
	method: 'DELETE',
	url: urlBase + 'reputations/' + unrep + '/',
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}

HungryFactory.getRep = function(userid){
	return $http({
	method: 'GET',
	url: urlBase + 'reputations/?author=' + userid,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}		
	})
}



HungryFactory.postRep = function(usertorep){
	return $http({
	method: 'POST',
	url: urlBase + 'reputations/',
	data: usertorep,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}


/*LIKES*/

HungryFactory.postLike = function(mentiontoLike){
	return $http({
	method: 'POST',
	url: urlBase + 'likes/',
	data: mentiontoLike,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}



/*HungryFactory.getLike = function(username){
	return $http({
	method: 'GET',
	url: urlBase + 'likes/?username=' + username,
	headers: {"Authorization" : "Token d893c9d137530bb4df69ec39545b4c57cba54dcf"}
});

}*/




return HungryFactory
});


function randomString(length, chars) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}
