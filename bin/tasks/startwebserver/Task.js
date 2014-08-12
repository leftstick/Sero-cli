'use strict';
var TaskRunner = require('terminal-task-runner');
var Base = TaskRunner.Base;



var compileLess = function(lessPath, dest) {
    var gulp = require('gulp');
    var less = require('gulp-less');
    gulp.src(lessPath + '/**/*')
        .pipe(less())
        .pipe(gulp.dest(dest));
};


var Task = Base.extend({
    id: 'StartWebServer',
    name: 'Start a static web server for current working directory',
    position: 4,
    run: function(cons) {

        var gulp = require('gulp');
        var path = require('path');
        var fs = require('fs');
        var webserver = require('gulp-webserver');
        var _ = require('lodash');

        var _this = this;

        this.prompt([{
            type: 'input',
            name: 'root',
            message: 'root for webserver',
            default: '.'
            }, {
            type: 'input',
            name: 'port',
            message: 'port for webserver',
            default: this.get('webserverport', 8080),
            validate: function(pass) {
                var num = Number(pass);
                return _.isNumber(num) && !_.isNaN(num);
            }
            }, {
            type: 'confirm',
            name: 'livereload',
            message: 'would you like to have livereload?',
            default: true
        }], function(res) {

                _this.put({
                    webserverport: res.port
                });

                var lessPath = path.join(res.root, 'less');
                var dest = path.join(res.root, 'css');

                fs.exists(lessPath, function(exists) {
                    if (!exists) {
                        return;
                    }
                    compileLess(lessPath, dest);
                });


                var stream = gulp.src(res.root)
                    .pipe(webserver({
                        host: '0.0.0.0',
                        port: res.port,
                        livereload: res.livereload,
                        directoryListing: false,
                        fallback: 'index.html'
                    }));

                stream.on('error', function(err) {
                    cons(err);
                });

                stream.on('close', function() {
                    cons();
                });

                stream.on('finish', function() {
                    cons();
                });


                fs.exists(lessPath, function(exists) {
                    if (!exists) {
                        return;
                    }
                    gulp.watch(lessPath + '/**/*', function(event) {
                        compileLess(lessPath, dest);
                    });
                });

            });

    }
});


module.exports = Task;