const Q = require('q');
const inquirer = require('inquirer');
const request = require('request');
const _ = require('lodash');
const Executor = require('../CmdExecutor');

var cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

var Task = function() {

    this._id = 'InstallPhoneGap';
    this._desc = 'Install PhoneGap globally with version';
};

Task.prototype.start = function() {
    var d = Q.defer();

    inquirer.prompt([{
        type: 'input',
        name: 'version',
        message: 'Type a specific version of PhoneGap',
        default: 'latest'
    }], function(res) {
        var ver = (res.version === 'latest') ? '' : ('@' + res.version);

        var exec = new Executor([{
            cmd: cmd,
            args: ['install', '-g', 'phonegap' + ver],
            outFilter: function(output) {
                return output.length > 8;
            }
        }]);

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
