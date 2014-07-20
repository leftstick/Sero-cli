var _ = require('lodash');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var utils = require('./Utils');

var finishHandler = function (err) {
    var args = Array.prototype.slice.call(arguments, 1);

    if (!err) {
        args.unshift('finish');
    } else {
        args.unshift(err);
        args.unshift('error');
    }

    EventEmitter.prototype.emit.apply(this.emitter, args);
};

var TaskManager = function () {

    var _taskFiles = fs.readdirSync(utils.taskDir);

    this._tasks = _taskFiles.map(function (file, index, files) {
        var path = utils.joinBinPath('tasks/' + file + '/Task');
        var Task = require(path);
        return new Task(path);
    });

    this._tasks = _.sortBy(this._tasks, function (task) {
        return task.priority;
    });

    this.emitter = new EventEmitter();

};

TaskManager.prototype.getTaskList = function () {
    return this._tasks;
};

TaskManager.prototype.getTaskByIndex = function (index) {
    return this._tasks[index];
};

TaskManager.prototype.run = function (taskId) {
    var task = _.find(this._tasks, function (task) {
        return task.id === taskId;
    });


    if (!task) {
        throw new Error('Task [' + taskId + '] is not valid.');
    }

    task.run(finishHandler.bind(this));

    return this.emitter;
};

module.exports = TaskManager;