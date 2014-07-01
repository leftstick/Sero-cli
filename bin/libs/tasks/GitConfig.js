const Q = require('q');
const inquirer = require('inquirer');
const _ = require('lodash');
const fs = require('fs');
const Executor = require('../CmdExecutor');

const configs = [
    'git config --local user.name <%= username %>',
    'git config --local user.email <%= useremail %>',
    'git config --local core.excludesfile $HOME/.gitignore',
    'git config --local core.autocrlf input',
    'git config --local color.ui true',
    'git config --local gui.encoding utf-8',
    'git config --local push.default tracking',
    'git config --local branch.autosetupmerge always',
    'git config --local branch.autosetuprebase always',
    'git config --local alias.co checkout',
    'git config --local alias.st status',
    'git config --local alias.br branch'];

var Task = function() {

    this._id = 'GitConfig';
    this._desc = 'Configure git options for current working directory';
};

Task.prototype.start = function() {
    var d = Q.defer();

    fs.stat('.git', function(err, stats) {
        var error = new Error('The working directory must be a valid git project.');
        error.isWarning = true;
        if (err) {
            d.reject(error);
            return;
        }
        if (!stats.isDirectory()) {
            d.reject(error);
            return;
        }

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
