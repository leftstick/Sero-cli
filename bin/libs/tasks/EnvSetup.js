const Q = require('q');
const _ = require('lodash');
const Executor = require('../CmdExecutor');

var Task = function() {

    this._id = 'EnvSetup';
    this._desc = 'Environment setup for mobile development';
};

Task.prototype.start = function() {
    var d = Q.defer();

    var exec = new Executor([
        'npm install -g phonegap',
        'npm install',
        'bower install'
    ]);

    exec.start().then(function() {
        d.resolve();
    }, function(err) {
        d.reject(err);
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
