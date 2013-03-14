/* outa[bot] // app.js
   Copyright (c) 2012-2013 outa[dev].
*/

(function() {
	if(process.argv[2] == undefined) {
		logtrace("you must specify a user to mimic as a parameter");
		process.exit(1);
	}

		//the module that will get us a random funny tweet
	var randomTweet = require("./lib/MyNextTweet.js"),
		//the twitter api module
		twitter = require('ntwitter'),
		
		//the username of the bot. not set to begin with, we'll get it when authenticating
		botUsername = null,
		//the username of the user we will try to mimic
		realDudeUsername = process.argv[2],
		apiParameters = null,

		//input the usernames of the users we want to parody, and the corresponding api keys of the bots
		realUsers = ['user1', 'user2'],
		apiKeys = [{
			consumer_key:        'YOUR_CONSUMER_TOKEN',
			consumer_secret:     'YOUR_CONSUMER_SECRET',
			access_token_key:    'YOUR_ACCESS_TOKEN_KEY',
			access_token_secret: 'YOUR_ACCESS_TOKEN_SECRET'
		}, {
			consumer_key:        'YOUR_SECOND_CONSUMER_TOKEN',
			consumer_secret:     'YOUR_SECOND_CONSUMER_SECRET',
			access_token_key:    'YOUR_SECOND_ACCESS_TOKEN_KEY',
			access_token_secret: 'YOUR_SECOND_ACCESS_TOKEN_SECRET'
		}];

	//the username is passed via a command-line parameter, check if it's in the array
	for(var i = 0; i < realUsers.length; i++) {
		if(realDudeUsername.toLowerCase() == realUsers[i]) {
			apiParameters = apiKeys[i];
			logtrace("found corresponding user " + realDudeUsername);
		}
	}
	
	if(apiParameters == null) {
		//if there was no parameter or if it wasn't in the array
		logtrace("you must specify a valid user to mimic as a parameter (setup in bot.js file)");
		process.exit(1);
	}

	//create an object using the keys we just determined
	twitterAPI = new twitter(apiParameters);
	
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
										logtrace("retweeted " + data.user.screen_name);
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