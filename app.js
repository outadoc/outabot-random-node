(function() {
	
	var http = require("http"),
		randomTweet = require("./MyNextTweet.js"),
		util = require('util'),
		twitter = require('ntwitter'),
	
		botUsername = "",
		realDudeUsername = "Kur0igetsu",
	
		twitterAPI = new twitter({
		consumer_key: 'vvnprToEpIE9h2TW14YEw',
		consumer_secret: 'jPcBFPYJugksOiEzuvE7PaCwCKw8tGU0JrqHu1uqkh0',
		access_token_key: '1048466726-Xqohd9MD7WUo7KE5fx4PJHUAOiTjKc7dFrgXL0D',
		access_token_secret: 'ScXUE6Go2MF2BQF4cTOcwrXggXujbIoBhzPtA4VNOQ'
	});
	
	twitterAPI.verifyCredentials(function(error, userdata) {
		if (error) {
			logtrace(error);
		} else {
			botUsername = userdata.screen_name;
			logtrace("logged in as " + userdata.screen_name);

			twitterAPI.stream('user', { with:'followings', track:'@' + botUsername },
				function(stream) {
					logtrace("streaming");

					stream.on('data', function(data) {
						if(data.text !== undefined 
							&& data.user.screen_name.toLowerCase() != botUsername.toLowerCase() 
							&& data.text.toLowerCase().indexOf('@' + botUsername.toLowerCase()) != -1 
							&& data.retweeted_status === undefined) {

							logtrace("mention from " + data.user.screen_name);

							twitterAPI.retweetStatus(data.id_str,
								function(error, rtdata) {
									if (error) {
										logtrace(error);
									} else {
										logtrace("retweeted " + rtdata.user.screen_name);
									}
								}
							);
							
							randomTweet.getNewTweet(realDudeUsername, twitterAPI, 
								function(error, tweet) {
									if (error) {
										logtrace(error);
									} else {
										logtrace("got random tweet");
										var tweetDone = '@' + data.user.screen_name + " " + tweet;
										
										twitterAPI.updateStatus(tweetDone.substring(0, 140), { in_reply_to_status_id: data.id_str },
											function(error, statusData) {
												if (error) {
													logtrace(error);
												} else {
													logtrace("replied to " + statusData.in_reply_to_screen_name);
												}
											}
										);
									}
								}
							);
						}
					});

					stream.on('end', function(e) {
						logtrace("STREAM STOPPED. (" + e + ")");
					});
					
					stream.on('error', function (e, code) {
						logtrace("STREAM ERROR. (" + e + " " + code + ")");
					});
				}
			);
		}
	});
	
	function logtrace(message) {
		console.log(getTimestampString() + message);
	}

	function getTimestampString() {
		var date = new Date();
		return "[" + date.getDate() + "/" + date.getMonth()+1 + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] ";
	}

})();