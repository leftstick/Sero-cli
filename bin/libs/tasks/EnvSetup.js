const Q = require('q');
const _ = require('lodash');
const fs = require('fs');
const Executor = require('../CmdExecutor');

var Task = function() {

    this._id = 'EnvSetup';
    this._desc = 'Environment setup for mobile development';
};

Task.prototype.start = function() {
    var d = Q.defer();

    fs.readdir('.', function(err, files) {
        if (err) {
            d.reject(err);
            return;
        }
        var jsonArr = _.filter(files, function(file) {
            return file === 'bower.json' || file === 'package.json';
        });
        if (jsonArr.length != 2) {
            var error = new Error('The working directory must be valid which contains bower.json and package.json.');
            error.isWarning = true;
            d.reject(error);
            return;
        }

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
