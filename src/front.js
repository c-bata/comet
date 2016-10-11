const {ipcRenderer} = require('electron');
body = document.getElementById('tweets');

ipcRenderer.on('tweet', function(event, args) {
    tweetText = args;
    var pTag = document.createElement('p');
    pTag.className = 'shoot';
    pTag.textContent = tweetText;
    body.appendChild(pTag);
    event.sender.send('tweet-reply', 'pong');  // 送信元へレスポンスを返す
});
