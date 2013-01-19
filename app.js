(function() {
	
	var randomTweet = require("./MyNextTweet.js"),	//the module that will get us a random funny tweet
		twitter = require('ntwitter'),				//the twitter api module
		
		//the username of the bot. not set to begin with
		botUsername = "",
		//the username of the user we will try to mimic
		realDudeUsername = "Kur0igetsu",
	
		//keys for the twitter api (depends on the app and on the user authenticated)
		twitterAPI = new twitter({
		consumer_key: 'vvnprToEpIE9h2TW14YEw',
		consumer_secret: 'jPcBFPYJugksOiEzuvE7PaCwCKw8tGU0JrqHu1uqkh0',
		access_token_key: '1048466726-Xqohd9MD7WUo7KE5fx4PJHUAOiTjKc7dFrgXL0D',
		access_token_secret: 'ScXUE6Go2MF2BQF4cTOcwrXggXujbIoBhzPtA4VNOQ'
	});
	
	//check if we have the rights to do anything
	twitterAPI.verifyCredentials(function(error, userdata) {
		if (error) {
			//if we don't, we'd better stop here anyway
			logtrace(error);
		} else {
			//the credentials check returns the username, so we can store it here
			botUsername = userdata.screen_name;
			logtrace("logged in as " + userdata.screen_name);

			//start listening to tweets that contain the bot's username using the streaming api
			twitterAPI.stream('user', { with:'followings', track:'@' + botUsername },
				function(stream) {
					logtrace("streaming");

					//when we're receiving something
					stream.on('data', function(data) {
						if(data.text !== undefined 														//if it's actually there
							&& data.user.screen_name.toLowerCase() != botUsername.toLowerCase() 		//if it wasn't sent by the bot itself
							&& data.text.toLowerCase().indexOf('@' + botUsername.toLowerCase()) != -1 	//if it's really mentionning us (it should)
							&& data.retweeted_status === undefined) {									//and if it isn't a retweet of one of our tweets

							logtrace("mention from " + data.user.screen_name);

							//we retweet the tweet that mentionned us
							twitterAPI.retweetStatus(data.id_str,
								function(error, rtdata) {
									if (error) {
										//if for whatever reason it didn't work, log it, but don't abandon either, we can still try replying to it
										logtrace(error);
									} else {
										logtrace("retweeted " + rtdata.user.screen_name);
									}
								}
							);
							
							//getting a random tweet using the "yes.thatcan.be/my/next/tweet/" method
							//we pass it the username of the real person, a reference to the twitter api module, and a callback
							randomTweet.getNewTweet(realDudeUsername, twitterAPI, 
								function(error, tweet) {
									if (error) {
										//handling the error, again
										logtrace(error);
									} else {
										logtrace("got random tweet");
										//store the final tweet (containing the mention)
										var tweetDone = '@' + data.user.screen_name + " " + tweet;
										
										//reply to the tweet that mentionned us
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
						//if it stops, log it
						logtrace("STREAM STOPPED. (" + e + ")");
					});
					
					stream.on('error', function (e, code) {
						//if it encounters an error... well, fuck.
						logtrace("STREAM ERROR. (" + e + " " + code + ")");
					});
				}
			);
		}
	});
	
	function logtrace(message) {
		//just log the message with a timestamp
		console.log(getTimestampString() + message);
	}

	function getTimestampString() {
		var date = new Date();
		//format nicely a timestamp we can put in front of our logs
		return "[" + date.getDate() + "/" + date.getMonth()+1 + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] ";
	}

})();