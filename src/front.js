const {ipcRenderer} = require('electron');
canvas = document.getElementById('tweetsCanvas');

class Tweet {
    constructor(text) {
        this.text = text;
        this.y = Math.random() * canvas.height;
        this.x = canvas.width;
        this.dx = -2;
    }

    isDelete(ctx) {
        let thresholdX = - ctx.measureText(this.text).width;
        return thresholdX > this.x
    }

    update() {
        this.x += this.dx;
    }
}

class Main {
    constructor(canvas, devicePixelRatio) {
        this.tweetList = [];
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = 'white';

        // These are not canvas.width and canvas.height;
        const width = window.parent.screen.width;
        const height = window.parent.screen.height;

        this.canvas.width = Math.round(width * devicePixelRatio);
        this.canvas.height = Math.round(height * devicePixelRatio);

        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
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
                this.ctx.fillText(tweet.text, tweet.x, tweet.y);
            }
        }
    }
}

