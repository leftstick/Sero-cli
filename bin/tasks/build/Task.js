'use strict';
var TaskRunner = require('terminal-task-runner');
var Base = TaskRunner.Base;

var Task = Base.extend({
    id: 'Build',
    name: 'Build Javascripts into one \'main.js\'',
    command: 'build',
    options: [
        {
            flags: '-u, --uglify',
            description: 'specify whether to uglify the compiled file'
        }
    ],
    check: function() {
        return true;
    },
    run: function(cons) {

        var _this = this;
        _this.prompt([
            {
                type: 'confirm',
                name: 'uglify',
                message: 'Would you like to uglify the compiled file?',
                default: true
            }
        ], function(answer) {
            _this.action(answer, cons);
        });

    },
    action: function(answer, cons) {

        var _this = this;
        var path = require('path');
        var fs = require('fs');
        var spawn = require('cross-spawn');
        var buildPath = 'build';
        var buildJsonPath = path.resolve(process.cwd(), 'js', 'build.js');
        if (!fs.existsSync(buildJsonPath)) {
            cons('js/build.json doesn\'t exist');
            process.exit(1);
        }

        var buildJson = require(buildJsonPath);
        buildJson.paths['css-builder'] = path.resolve(__dirname, 'css-builder');
        buildJson.paths.normalize = path.resolve(__dirname, 'normalize');
        buildJson.optimize = answer.uglify ? 'uglify2' : 'none';
        // buildJson.optimize = 'none';
        buildJson.generateSourceMaps = false;
        buildJson.preserveLicenseComments = true;
        if (!buildJson.exclude) {
            buildJson.exclude = [];
        }
        buildJson.exclude.push('css-builder');
        buildJson.exclude.push('normalize');

        var compile = function(err) {
            if (err) {
                cons(err);
                return;
            }
            var gulp = require('gulp');
            var stream = gulp.src(['**/*', '*.*'])
                .pipe(gulp.dest('build/'));

            stream.on('end', function() {
                fs.writeFileSync(path.resolve(buildPath, 'js', 'build.js'), JSON.stringify(buildJson), {
                    encoding: 'utf8'
                });
                var result = spawn(process.execPath, [
                    path.resolve(__dirname, 'r.js'),
                    '-o',
                    'build.js'
                ], {
                    cwd: path.resolve(process.cwd(), 'build', 'js')
                });

                result.stdout.pipe(process.stdout);
                result.stderr.pipe(process.stderr);

                result.on('close', function(code) {
                    cons();
                });
            });
        };

        if (fs.existsSync(buildPath) && fs.statSync(buildPath).isDirectory()) {
            var rimraf = require('rimraf');
            rimraf(buildPath, compile);
            return;
        }
        compile();
    }
});


module.exports = Task;
