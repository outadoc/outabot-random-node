#What is it?
Just a twitter bot that listens for what you're saying. It will retweet every tweet mentionning him, and reply something random using Yes That Can Be My Next Tweet.

#Configure
Begin by opening a new account for the bot on Twitter. Then, create an application for this account on dev.twitter.com, and get the API keys.

Setup in bot.js. Replace the *realUsers* array with the username(s) of the user(s) you want to parody, and add the Twitter API keys of the bot you created on twitter to the *apiKeys* array. Like this:

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

#Usage
Install Node.js, and pass it bot.js with as an argument the username of the person you want to parody (*not the username of the bot!*). Like this:

	node bot.js user1