'use strict';
var TaskRunner = require('terminal-task-runner');
var Base = TaskRunner.Base;

var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var browserSync = require('browser-sync');
var history = require('connect-history-api-fallback');

var isInt = function(val) {
    return !isNaN(parseInt(val));
};

var compileLess = function(lessPath, dest, paths) {
    var less = require('gulp-less');
    var LessPluginAutoPrefix = require('less-plugin-autoprefix');
    var autoprefix = new LessPluginAutoPrefix({
        browsers: [
            'last 10 versions'
        ],
        cascade: true
    });
    var plumber = require('gulp-plumber');

    gulp.src(lessPath + '/main.less')
        .pipe(plumber())
        .pipe(less({paths: paths, plugins: [autoprefix]}))
        .pipe(gulp.dest(dest));

    TaskRunner.logger.info(lessPath + '/main.less was compiled');
};

var setupServer = function(answer) {
    var bs = browserSync.create();
    var initOpts = {
        ui: false,
        server: {
            baseDir: process.cwd(),
            directory: false
        },
        files: [
            './**/*.*'
        ],
        port: answer.port || 8080,
        open: 'local',
        reloadOnRestart: true,
        injectChanges: true
    };
    if (answer.pushState) {
        initOpts.middleware = [history()];
    }

    bs.init(initOpts);
    bs.reload();
};


var Task = Base.extend({
    id: 'StartWebServer',
    name: 'Start a static web server for current working directory',
    command: 'server',
    options: [
        {
            flags: '-p, --port <port>',
            description: 'specify the port of the static webserver'
        },
        {
            flags: '-l, --paths [paths]',
            description: 'specify the less paths'
        },
        {
            flags: '-h, --pushState',
            description: 'specify whether to enable html5 pust state mode'
        }
    ],
    check: function(cmd) {
        return cmd.port;
    },
    run: function(cons) {
        var _this = this;

        this.prompt([
            {
                type: 'input',
                name: 'port',
                message: 'port for webserver',
                default: this.get('webserverport', 8080),
                validate: function(pass) {
                    return isInt(pass);
                }
            },
            {
                type: 'input',
                name: 'paths',
                message: 'paths for less(separate in comma)',
                when: function(pass) {
                    return fs.existsSync(path.join(process.cwd(), 'less'));
                }
            },
            {
                type: 'confirm',
                name: 'pushState',
                message: 'would you like to enable html5 push state mode?',
                default: true
            }
        ], function(answer) {
            _this.action(answer, cons);
        });
    },
    action: function(answer, cons) {

        if (!isInt(answer.port)) {
            return cons('port must be int');
        }

        this.put({webserverport: parseInt(answer.port)});

        var lessPath = path.join(process.cwd(), 'less');
        var dest = path.join(process.cwd(), 'css');

        var paths = answer.paths && answer.paths.split ? answer.paths.split(',')
            .forEach(function(p) {
                paths.push(path.join(process.cwd(), p));
            }) : [];

        fs.exists(lessPath, function(exists) {
            if (!exists) {
                return;
            }
            compileLess(lessPath, dest, paths);
        });

        setupServer(answer);

        fs.exists(lessPath, function(exists) {
            if (!exists) {
                return;
            }
            gulp.watch(lessPath + '/**/*', function(event) {
                compileLess(lessPath, dest, paths);
            });
        });

    }
});


module.exports = Task;
