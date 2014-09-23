'use strict';
var TaskRunner = require('terminal-task-runner');
var Base = TaskRunner.Base;



var compileLess = function(lessPath, dest, paths) {
    var gulp = require('gulp');
    var less = require('gulp-less');
    var prefix = require('gulp-autoprefixer');
    var sourcemap = require('gulp-sourcemaps');
    var plumber = require('gulp-plumber');

    gulp.src(lessPath + '/main.less')
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(less({
            paths: paths,
            compress: false
        }))
        .pipe(sourcemap.write())
        .pipe(prefix({
            browsers: ['last 5 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(dest));

    TaskRunner.logger.info(lessPath + '/main.less was compiled');
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
            type: 'input',
            name: 'paths',
            message: 'paths for less(separate in comma)',
            when: function(pass) {
                return fs.existsSync(path.join(pass.root, 'less'));
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

            var paths = [];

            if (res.paths) {
                _.each(res.paths.split(','), function(p) {
                    paths.push(path.join(res.root, p));
                });
            }

            fs.exists(lessPath, function(exists) {
                if (!exists) {
                    return;
                }
                compileLess(lessPath, dest, paths);
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
                    compileLess(lessPath, dest, paths);
                });
            });

        });

    }
});


module.exports = Task;
