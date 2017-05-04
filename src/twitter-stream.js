const Twitter = require('twitter');
//noinspection JSUnusedLocalSymbols
const {ipcMain} = require('electron');

// If use let, this variable cleaned up by runtime(GC).
var _twitter_stream = null;
let hashTag = process.env.HASHTAG;
let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

function startStream(win) {
    // Set timelilne for retrieving hashtag
    client.stream('statuses/filter', {track: hashTag}, function (stream) {
        _twitter_stream = stream;
        stream.on('data', function (tweet) {
            win.webContents.send('tweet', tweet.text);
            console.log(tweet.text)
        });
        // Handle errors
        stream.on('error', function (error) {
            console.log(error)
        })
    })
}

function stopStream() {
    _twitter_stream.destroy()
}

module.exports = {
    startStream: startStream,
    stopStream: stopStream
};
