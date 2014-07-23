#!/usr/bin/env node

'use strict';

var path = require('path');
var TaskRunner = require('terminal-task-runner');

var logger = TaskRunner.logger;


var title = 'ANGAP SAVE YOU FROM COMPLICATED DEVELOPMENT WORKS';
var subtitle = 'Select an task and hit Enter to begin';

var runner = TaskRunner.createMenu({
    title: title,
    subtitle: subtitle,
    taskDir: path.resolve(__dirname, 'tasks'),
    helpFile: path.resolve(__dirname, 'help.txt')
});
