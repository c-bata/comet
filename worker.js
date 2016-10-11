var Twitter = require('twitter');

// Set up Twitter client
let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
let hashTag = process.env.HASHTAG


client.stream('statuses/filter', {track: hashTag}, function(stream) {
  stream.on('data', function(tweet) {
    // Log it to console
    console.log(tweet.text);
  });
  // Handle errors
  stream.on('error', function (error) {
    console.log(error);
  });
});
