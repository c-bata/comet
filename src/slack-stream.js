"use strict";

let first_flg = true;
let slack_sdk_path = '@slack/client';
let RtmClient = require(slack_sdk_path).RtmClient;
let RTM_EVENTS = require(slack_sdk_path).RTM_EVENTS;
let CLIENT_EVENTS = require(slack_sdk_path).CLIENT_EVENTS;
let bot_token = process.env.SLACK_BOT_TOKEN || '';
let bot_channel = process.env.SLACK_BOT_CHANNEL || '';
// var MemoryDataStore = require(slack_sdk_path).MemoryDataStore;

let rtm = null;

function makeClient(win) {
    rtm = new RtmClient(bot_token, {
        // Sets the level of logging we require
        // logLevel: 'error',
        // Initialise a data store for our client, this will load additional helper functions for the storing and retrieval of data
        // dataStore: new MemoryDataStore()
    });
    // The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
        console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
    });
    // ここでメッセージを取得
    rtm.on(RTM_EVENTS.MESSAGE, function (message) {
        // let user = rtm.dataStore.getUserById(rtm.activeUserId)
        // console.log(user);
        if (message.channel === bot_channel) {
            win.webContents.send('tweet', message.text);
            console.log(message.text);
        }
    });
}

function startStream(win) {
    console.log('startStream');
    makeClient(win);
    if (first_flg) {
        rtm.start();
        first_flg = false;
    } else {
        if (!rtm.connected) {
            console.log('reconnect');
            rtm.start();
        }
    }
}

function stopStream() {
    console.log('stopStream');
    // rtm.handleWsClose();
    if (rtm.connected) {
        console.log('disconnect');
        rtm.disconnect();
    }
}

module.exports = {
    startStream: startStream,
    stopStream: stopStream
};