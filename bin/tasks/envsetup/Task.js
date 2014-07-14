var _ = require('lodash');
var fs = require('fs');
var Executor = require('../../libs/CmdExecutor');
var BaseTask = require('../../libs/BaseTask');

var Task = BaseTask.extend({
    getId: function() {
        return 'envsetup';
    },
    getName: function() {
        return 'Environment setup for mobile development';
    },
    getPriority: function() {
        return 1;
    },
    run: function(cons) {
        fs.readdir('.', function(err, files) {
            if (err) {
                cons(err);
                return;
            }
            if (true) {
                cons();
                return;
            }
            var jsonArr = _.filter(files, function(file) {
                return file === 'bower.json' || file === 'package.json';
            });

            if (jsonArr.length != 2) {
                var error = new Error('The working directory must be valid which contains bower.json and package.json.');
                cons(error);
                return;
            }

            var exec = new Executor([
                'npm install -g phonegap',
                'npm install',
                'bower install'
            ]);

            exec.start().then(function() {
                cons();
            }, function(err) {
                cons(err);
            });

        });
    }
});


module.exports = Task;
