const electron = require('electron')
const {app, BrowserWindow, ipcMain} = require('electron')

var Twitter = require('twitter');

// Set up Twitter client
let hashTag = process.env.HASHTAG
let win
let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})


function createWindow () {
  // Create the browser window.
  let size = electron.screen.getPrimaryDisplay().size
  win = new BrowserWindow({
    left: 0,
    top: 0,
    width: size.width,
    height: size.height,
    frame: false,
    show: true,
    transparent: true,
    resizable: false
  });

  win.setIgnoreMouseEvents(true);
  win.setAlwaysOnTop(true);
  win.loadURL(`file://${__dirname}/index.html`)

  // Set timelilne for retrieving hashtag
  client.stream('statuses/filter', {track: hashTag}, function(stream) {
    stream.on('data', function(tweet) {
      win.webContents.send('tweet', tweet.text);
      console.log(tweet.text);
    });
    // Handle errors
    stream.on('error', function (error) {
      console.log(error);
    });
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
