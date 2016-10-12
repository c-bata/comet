const electron = require('electron')
const {app, BrowserWindow, Tray, Menu, ipcMain} = require('electron')

var Twitter = require('twitter')

// Set up Twitter client
let hashTag = process.env.HASHTAG
let win = null
let tray = null
let _twitter_stream = null
let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

function createTray() {
  const tray = new Tray(`${__dirname}/../resource/tray.png`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => {
        ipcMain.send('show-settings-dialog')
      }
    },
    {
      label: 'Start',
      click: () => {
          console.log('Start twitter streaming.')
          startStream(win)
      }
    },
    {
      label: 'Stop',
      click: () => {
        console.log('Stop twitter streaming.')
        _twitter_stream.destroy()
      }
    },
    {
      label: 'Quit',
      click: () => {
        console.log('Bye!')
        app.quit()
      }
    }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
}

function startStream(win) {
  // Set timelilne for retrieving hashtag
  client.stream('statuses/filter', {track: hashTag}, function(stream) {
    _twitter_stream = stream
    stream.on('data', function(tweet) {
      win.webContents.send('tweet', tweet.text)
      console.log(tweet.text)
    })
    // Handle errors
    stream.on('error', function (error) {
      console.log(error)
    })
  })
}


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
  })

  win.setIgnoreMouseEvents(true)
  win.setAlwaysOnTop(true)
  win.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', () => {
  createWindow()
  createTray()
})

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
    createTray()
  }
})
