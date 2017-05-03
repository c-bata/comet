const {app} = require('electron')
const createTray = require('./tray')

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
})
