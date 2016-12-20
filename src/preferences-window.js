const electron = require('electron')
const {BrowserWindow} = require('electron')

var win = null

function createWindow () {
    win = new BrowserWindow({
        width: 300,
        height: 360,
        resizable: false,
        titleBarStyle: 'hidden-inset'
    })
    win.loadURL(`file://${__dirname}/preferences.html`)

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
