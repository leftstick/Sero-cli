var _ = require('lodash');
var fs = require('fs');
var Executor = require('../../libs/CmdExecutor');
var BaseTask = require('../../libs/BaseTask');

var Task = BaseTask.extend({
    id: 'installbower',
    name: 'Install bower dependencies',
    priority: 3,
    run: function (cons) {


        fs.readdir('.', function (err, files) {
            if (err) {
                cons(err);
                return;
            }
            var jsonArr = _.filter(files, function (file) {
                return file === 'bower.json';
            });

            if (jsonArr.length != 1) {
                cons('The working directory must be valid which contains bower.json.');
                return;
            }

            var exec = new Executor(['bower install']);

            exec.start().then(function () {
                cons();
                return;
            }, function (err) {
                cons(err);
                return;
            });

        });

    }
});


module.exports = Task;