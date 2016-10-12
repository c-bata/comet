const electron = require('electron')
const {BrowserWindow} = require('electron')

var win = null

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
    win.loadURL(`file://${__dirname}/twitter-stream.html`)

    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null
    })
    return win
}

function closeWindow () {
    win.close()
}

module.exports = {
    create: createWindow,
    close: closeWindow
}
