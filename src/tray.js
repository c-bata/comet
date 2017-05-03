// const {app, Tray, Menu, ipcMain} = require('electron');

let stream_type = process.env.STREAM_TYPE || 'twitter';
//noinspection JSUnusedLocalSymbols
const {startStream, stopStream} = require('./' + stream_type + '-stream');
//noinspection JSUnusedLocalSymbols
const {createWindow, closeWindow} = require('./twitter-window');

// let trayTemplate = [
//     {
//         label: 'Settings',
//         click: () => {
//             ipcMain.send('show-settings-dialog')
//         }
//     },
//     {
//         label: 'Start',
//         click: () => {
//             console.log('Start twitter streaming.');
//             let win = createWindow();
//             startStream(win)
//         }
//     },
//     {
//         label: 'Stop',
//         click: () => {
//             console.log('Stop twitter streaming.');
//             closeWindow();
//             stopStream()
//         }
//     },
//     {
//         label: 'Quit',
//         click: () => {
//             console.log('Bye!');
//             app.quit()
//         }
//     }
// ];

module.exports = function createTray() {
    // const tray = new Tray(`${__dirname}/../resource/tray.png`)
    // const contextMenu = Menu.buildFromTemplate(trayTemplate)
    // tray.setToolTip('This is my application.')
    // tray.setContextMenu(contextMenu)
    // トレイが勝手に消えるため、ひとまず使わない
    let win = createWindow();
    startStream(win)
};
