#!/usr/bin/env node

const inquirer = require('inquirer');
const TaskManager = require('./libs/TaskManager');

const taskMgr = new TaskManager();


inquirer.prompt([{
    type: 'list',
    name: 'taskId',
    message: 'Select a task and hit Enter to begin \n ────────────────────────────────────────',
    default: taskMgr.getTaskList[0],
    choices: taskMgr.getTaskList()

}], function(res) {
    taskMgr.run(res.taskId);
});

// 'use strict';

// process.title = 'AnGap-cli';

// var basedir = process.cwd();

// var cli = require('cli');

// cli.setApp('./package.json');
// cli.enable('version');

// cli.parse(null, ['install', 'test', 'edit', 'remove', 'uninstall', 'ls']);

// console.log('Command is: ' + cli.command);
