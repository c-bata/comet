"use strict";

// .env
require('dotenv').config({ path: __dirname + '/../.env' })

const electron = require("electron")
const app = electron.app
const createTray = require('./tray');

// クラッシュレポート
let crash_report_url = process.env.CRASH_REPORT_URL || '';
if (crash_report_url !== '') {
    const crashReporter = electron.crashReporter
    crashReporter.start({
        productName: 'comet.app',
        companyName: 'An individual',
        submitURL: crash_report_url,
        autoSubmit: false
    });
}

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
