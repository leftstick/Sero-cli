const Q = require('q');
const inquirer = require('inquirer');
const _ = require('lodash');
const Executor = require('../CmdExecutor');

const configs = [{
    cmd: 'git',
    args: ['config', '--local', 'user.name', '<%= username %>'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'user.email', '<%= useremail %>'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'core.excludesfile', '$HOME/.gitignore'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'core.autocrlf', 'input'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'color.ui', 'true'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'gui.encoding', 'utf-8'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'push.default', 'tracking'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'branch.autosetupmerge', 'always'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'branch.autosetuprebase', 'always'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'alias.co', 'checkout'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'alias.st', 'status'],
    outself: true
}, {
    cmd: 'git',
    args: ['config', '--local', 'alias.br', 'branch'],
    outself: true
}];

var Task = function() {

    this._id = 'GitConfig';
    this._desc = 'Configure git options for current working directory';
};

Task.prototype.start = function() {
    var d = Q.defer();

    inquirer.prompt([{
        type: 'input',
        name: 'username',
        message: 'username:',
        default: process.env.USERNAME
    }, {
        type: 'input',
        name: 'useremail',
        message: 'useremail:',
        validate: function(pass) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(pass);
        }
    }], function(res) {

        var exec = new Executor(configs, res);

        exec.start().then(function() {
            d.resolve();
        }, function(err) {
            d.reject(err);
        });

    });

    return d.promise;
};

Task.prototype.getID = function() {
    return this._id;
};

Task.prototype.getDesc = function() {
    return this._desc;
};

module.exports = Task;
