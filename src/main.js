const electron = require('electron')
const {app, BrowserWindow, Tray, Menu, ipcMain} = require('electron')

var Twitter = require('twitter')

let hashTag = process.env.HASHTAG
// If use let, this variable cleaned up by runtime(GC).
var tray = null
var win = null
// Set up Twitter client
let _twitter_stream = null
let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})
let trayTemplate = [
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
      createWindow()
      startStream()
    }
  },
  {
    label: 'Stop',
    click: () => {
      console.log('Stop twitter streaming.')
      win.close()
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
]

function createTray() {
  const tray = new Tray(`${__dirname}/../resource/tray.png`)
  const contextMenu = Menu.buildFromTemplate(trayTemplate)
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
}

function startStream() {
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
  createTray()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createTray()
  }
})
