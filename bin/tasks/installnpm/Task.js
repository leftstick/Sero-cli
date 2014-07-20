var _ = require('lodash');
var fs = require('fs');
var Executor = require('../../libs/CmdExecutor');
var BaseTask = require('../../libs/BaseTask');

var Task = BaseTask.extend({
    id: 'installnpm',
    name: 'Install npm dependencies',
    priority: 2,
    run: function (cons) {


        fs.readdir('.', function (err, files) {
            if (err) {
                cons(err);
                return;
            }
            var jsonArr = _.filter(files, function (file) {
                return file === 'package.json';
            });

            if (jsonArr.length != 1) {
                cons('The working directory must be valid which contains package.json.');
                return;
            }

            var exec = new Executor(['npm install']);

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