#!/usr/bin/env node

const inquirer = require('inquirer');
const TaskManager = require('./libs/TaskManager');
const taskMgr = new TaskManager();

require('./libs/Print')();


inquirer.prompt([{
        type: 'list',
        name: 'taskId',
        message: 'Select a task and hit Enter to begin \n ────────────────────────────────────────',
        default: taskMgr.getTaskList[0],
        choices: taskMgr.getTaskList()
    }], function(res) {
    taskMgr.run(res.taskId).then(function() {
        var msg = 'Task [' + res.taskId + '] executed successfully!';
        console.success(msg);
    }, function(err) {
        if (err && err.isWarning) {
            console.warn(err);
        } else if (err) {
            console.error(err);
        }
        console.error('Task [' + res.taskId + '] failed!');
    });
});
