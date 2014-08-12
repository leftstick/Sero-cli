var TaskRunner = require('terminal-task-runner');
var Shell = TaskRunner.shell;
var Base = TaskRunner.Base;

var Task = Base.extend({
    id: 'installnpm',
    name: 'Install npm dependencies',
    position: 2,
    run: function(cons) {

        var _ = require('lodash');
        var fs = require('fs');
        fs.readdir('.', function(err, files) {
            if (err) {
                cons(err);
                return;
            }
            var jsonArr = _.filter(files, function(file) {
                return file === 'package.json';
            });

            if (jsonArr.length != 1) {
                cons('The working directory must be valid which contains package.json.');
                return;
            }

            var exec = new Shell(['npm install']);

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