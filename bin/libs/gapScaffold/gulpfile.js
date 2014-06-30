var gulp = require('gulp');
var runner = require('./dev/TaskRunner');



gulp.task('platform', function(cb) {
    return runner('platform', cb);
});

gulp.task('build', function(cb) {
    return runner('build', cb);
});

gulp.task('deploy', ['build'], function(cb) {
    return runner('deploy', cb);
});

gulp.task('gitconfig', function(cb) {
    return runner('gitconfig', cb);
});

gulp.task('dev', function(cb) {
    return runner('dev', cb);
});
