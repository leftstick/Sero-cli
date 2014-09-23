'use strict';
var Cmd = function(args, options) {
    this.commander = require('commander');
    this.args = args;
    this.taskDir = options.taskDir;
    this.taskList = options.taskList;
    this.preferenceName = options.preferenceName;
    this.version = options.version;
};


Cmd.prototype.shouldRunInCliMode = function() {
    return this.args.length > 0;
};

Cmd.prototype.exec = function() {
    var _this = this;
    var path = require('path');
    this.logger = require('terminal-task-runner').logger;

    this.commander
        .version(this.version);

    this.taskList.forEach(function(taskname) {
        var TaskMod = require('./tasks/' + taskname + '/Task');

        var task = new TaskMod({
            path: path.resolve(_this.taskDir, taskname, 'Task'),
            preferenceName: _this.preferenceName
        });

        var cmder = _this.commander
            .command(task.command);

        cmder.description(task.name);
        if (task.options) {
            task.options.forEach(function(option) {
                cmder
                    .option(option.flags, option.description);
            });
        }
        cmder
            .action(function(cmd) {
                if (!task.check(cmd)) {
                    cmd.help();
                }
                task.action(cmd, function(err) {
                    if (!err) {
                        _this.logger.success('finish: ', task.name);
                    } else {
                        _this.logger.error('failed: ', err);
                    }

                });
            });

    });

    this.commander.parse(process.argv);
};

module.exports = Cmd;
