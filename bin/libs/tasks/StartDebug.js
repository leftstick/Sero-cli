const Q = require('q');
const gulp = require('gulp');
const connect = require('gulp-connect');
const CopyBowers = require('../CopyBowers');
const _ = require('lodash');


var startServer = function(defer) {

    gulp.watch([
        './www/js/**/*.html',
        './www/css/*.css',
        './www/img/*.*',
        './www/js/**/*.js',
        '!./www/js/libs/*.js'
    ], function(event) {

        gulp.src([event.path]).pipe(connect.reload());

    });

    connect.server({
        root: './www/',
        port: 8080,
        livereload: true
    });

    defer.resolve();
};


var Task = function() {

    this._id = 'StartDebug';
    this._desc = 'Start debugging in browser';
};

Task.prototype.start = function() {
    var d = Q.defer();

    new CopyBowers('debug').start().then(function() {
        startServer(d);
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
