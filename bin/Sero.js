#!/usr/bin/env node

'use strict';

var path = require('path');
var TaskRunner = require('terminal-task-runner');
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');



// Checks for available update and returns an instance
var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version,
    updateCheckInterval: 1000 * 60 * 60
});

notifier.notify();

var title = 'SERO SAVE YOU FROM COMPLICATED DEVELOPMENT WORKS';
var subtitle = 'Select an task and hit Enter to begin';

var runner = TaskRunner.createMenu({
    title: title,
    subtitle: subtitle,
    taskDir: path.resolve(__dirname, 'tasks'),
    helpFile: path.resolve(__dirname, 'help.txt'),
    version: 'v1.0.6',
    preferenceMgr: TaskRunner.getPrefMgr('.sero')
});