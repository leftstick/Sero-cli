#!/usr/bin/env node

'use strict';

var path = require('path');
var TaskRunner = require('terminal-task-runner');
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');
var taskList = require('./taskList');

var Cmd = require('./command');

// Checks for available update and returns an instance
var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version,
    updateCheckInterval: 1000 * 60 * 60
});

notifier.notify();


var options = {
    title: 'SERO SAVE YOU FROM COMPLICATED DEVELOPMENT WORKS',
    subtitle: 'Select an task and hit Enter to begin',
    taskDir: path.resolve(__dirname, 'tasks'),
    taskList: taskList,
    helpFile: path.resolve(__dirname, 'help.txt'),
    version: 'v' + pkg.version,
    preferenceName: '.sero',
    width: 65
};

var cmder = new Cmd(process.argv.slice(2), options);
if (cmder.shouldRunInCliMode()) {
    cmder.exec();
} else {
    TaskRunner.createMenu(options);
}
