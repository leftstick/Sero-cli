var _ = require('lodash');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var utils = require('./Utils');

var finishHandler = function(err) {
    var args = Array.prototype.slice.call(arguments, 1);

    if (!err) {
        args.unshift('finish');
    } else {
        args.unshift('error');
    }
    EventEmitter.prototype.emit.apply(this.emitter, args);
};

var TaskManager = function() {

    var _taskFiles = fs.readdirSync(utils.taskDir);

    this._tasks = _.map(_taskFiles, function(file) {
        var Task = require(utils.taskDir + '/' + file + '/Task');
        return new Task();
    });

    this._tasks = _.sortBy(this._tasks, function(task) {
        return task.getPriority();
    });

    this.emitter = new EventEmitter();

};

TaskManager.prototype.getTaskList = function() {
    return this._tasks;
};

TaskManager.prototype.run = function(taskId) {
    var task = _.find(this._tasks, function(task) {
        return task.getId() === taskId;
    });

    if (!task) {
        throw new Error('Task [' + taskId + '] is not valid.');
    }

    task.run(finishHandler.bind(this));

    return this.emitter;
};

module.exports = TaskManager;
