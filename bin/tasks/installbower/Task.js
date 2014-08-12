var TaskRunner = require('terminal-task-runner');
var Shell = TaskRunner.shell;
var Base = TaskRunner.Base;

var Task = Base.extend({
    id: 'installbower',
    name: 'Install bower dependencies',
    position: 3,
    run: function(cons) {

        var _ = require('lodash');
        var fs = require('fs');

        fs.readdir('.', function(err, files) {
            if (err) {
                cons(err);
                return;
            }
            var jsonArr = _.filter(files, function(file) {
                return file === 'bower.json';
            });

            if (jsonArr.length != 1) {
                cons('The working directory must be valid which contains bower.json.');
                return;
            }

            var exec = new Shell(['bower install']);

            exec.start().then(function() {
                cons();
                return;
            }, function(err) {
                    cons(err);
                    return;
                });

        });

    }
});


module.exports = Task;