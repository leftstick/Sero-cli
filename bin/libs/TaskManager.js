const _ = require('lodash');
const fs = require('fs');
const path = require('path');

var TaskManager = function() {

    var _taskFiles = fs.readdirSync(path.join(__dirname, './tasks'));

    this._tasks = _.map(_taskFiles, function(file) {
        var moduleName = file.substring(0, file.indexOf('.js'));
        var Task = require('./tasks/' + moduleName);
        return new Task();
    });

    this._taskArr = _.map(this._tasks, function(task) {
        return {
            name: task.getDesc(),
            value: task.getID()
        };
    });

};

TaskManager.prototype.getTaskList = function() {
    return this._taskArr;
};

TaskManager.prototype.run = function(taskId) {
    var task = _.find(this._tasks, function(task) {
        return task.getID() === taskId;
    });

    if (!task) {
        throw new Error('Task [' + taskId + '] is not valid.');
    }

    return task.start(); //start has to be a promise
};

module.exports = TaskManager;
