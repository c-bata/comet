const {ipcRenderer} = require('electron');

class Tweet {
    constructor(text) {
        this.text = text;
        this.y = Math.random() * canvas.height;
        this.x = canvas.width;
        this.dx = - 2 - (Math.random() * 5);
    }

    isDelete(ctx) {
        let thresholdX = - ctx.measureText(this.text).width;
        return thresholdX > this.x
    }

    update() {
        this.x += this.dx;
    }
}

class CanvasManager {
    constructor(canvas) {
        this.tweetList = [];
        this.canvas = canvas;
        // These are not canvas.width and canvas.height;
        this.canvas.width = window.parent.screen.width;
        this.canvas.height = window.parent.screen.height;

        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.font = "40px 'Sans-serif'";
        this.ctx.lineWidth = 5;
    }

    pushTweet(tweet) {
        this.tweetList.push(tweet);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.tweetList.length - 1; i >= 0; i -= 1) {
            if (this.tweetList[i].isDelete(this.ctx)) {
                this.tweetList.splice(i, 1);
            } else {
                let tweet = this.tweetList[i];
                tweet.update();
                this.tweetList[i] = tweet;
                this.ctx.strokeText(tweet.text, tweet.x, tweet.y);
                this.ctx.fillText(tweet.text, tweet.x, tweet.y);
            }
        }
    }
}

function setIpcRenderer(canvasManager) {
    ipcRenderer.on('tweet', function(event, args) {
        var tweet = new Tweet(args);
        canvasManager.pushTweet(tweet);
        event.sender.send('tweet-reply', 'pong');
    });
}
