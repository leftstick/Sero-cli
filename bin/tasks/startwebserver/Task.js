var gulp = require('gulp');
var webserver = require('gulp-webserver');
var _ = require('lodash');
var inquirer = require('inquirer');
var TaskRunner = require('terminal-task-runner');
var Base = TaskRunner.Base;


var Task = Base.extend({
    id: 'StartWebServer',
    name: 'Start a static web server for current working directory',
    position: 4,
    run: function (cons) {

        var _this = this;

        inquirer.prompt([{
            type: 'input',
            name: 'root',
            message: 'root for webserver',
            default: '.'
        }, {
            type: 'input',
            name: 'port',
            message: 'port for webserver',
            default: this.get('webserverport', 8080),
            validate: function (pass) {
                return !!pass && _.isNumber(pass);
            }
        }, {
            type: 'confirm',
            name: 'livereload',
            message: 'would you like to have livereload?',
            default: true
        }], function (res) {

            _this.put({
                webserverport: res.port
            });

            var stream = gulp.src(res.root)
                .pipe(webserver({
                    host: '0.0.0.0',
                    port: res.port,
                    livereload: res.livereload,
                    directoryListing: false,
                    fallback: 'index.html'
                }));

            stream.on('error', function (err) {
                cons(err);
            });

            stream.on('close', function () {
                cons();
            });

            stream.on('finish', function () {
                cons();
            });
        });

    }
});


module.exports = Task;