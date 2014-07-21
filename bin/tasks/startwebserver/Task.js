var gulp = require('gulp');
var webserver = require('gulp-webserver');
var BaseTask = require('../../libs/BaseTask');


var Task = BaseTask.extend({
    id: 'StartWebServer',
    name: 'Start a static web server for current working directory',
    priority: 4,
    run: function(cons) {

        var stream = gulp.src('.')
        .pipe(webserver({
            host: '0.0.0.0',
            port: 8080,
            livereload: true,
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
    }
});


module.exports = Task;