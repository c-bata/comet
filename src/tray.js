const {app, Tray, Menu, ipcMain} = require('electron')
const {startStream, stopStream} = require('./twitter-stream')
const TwitterWindow = require('./twitter-window')
const PreferencesWindow = require('./preferences-window')

let trayTemplate = [
    {
        label: 'Preferences...',
        accelerator: 'Command+,',
        click: () => {
            console.log('Open preference window.')
            PreferencesWindow.create()
        }
    },
    {
        label: 'Start',
        click: () => {
            console.log('Start twitter streaming.')
            let twitterWindow = TwitterWindow.create()
            startStream(twitterWindow)
        }
    },
    {
        label: 'Stop',
        click: () => {
            console.log('Stop twitter streaming.')
            TwitterWindow.close()
            stopStream()
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

module.exports = function createTray() {
    const tray = new Tray(`${__dirname}/../resource/tray.png`)
    const contextMenu = Menu.buildFromTemplate(trayTemplate)
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
}
