"use strict";

// .env
require('dotenv').config({ path: __dirname + '/../.env' })

const electron = require("electron")
const app = electron.app
const createTray = require('./tray');

// クラッシュレポート
const crashReporter = electron.crashReporter
crashReporter.start({
    productName: 'sample.app',
    companyName: 'COMPANY',
    submitURL: 'https://your-domain.com/url-to-submit',
    autoSubmit: false
});

app.on('ready', () => {
    createTray()
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
});
