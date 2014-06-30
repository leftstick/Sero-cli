const Q = require('q');
const inquirer = require('inquirer');
const request = require('request');
const _ = require('lodash');
const Executor = require('../CmdExecutor');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const template = require('gulp-template');

const mail_reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var options = {
    url: 'https://api.github.com/user/repos',
    method: 'POST',
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'leftstick@qq.com',
        'Content-type': 'application/json; charset=utf-8'
    },
    auth: {
        user: '',
        pass: ''
    },
    encoding: 'utf-8',
    body: {
        'name': '',
        'description': '',
        'auto_init': true,
        'license_template': 'mit'
    }
};

var createRepo = function(opts, defer, answer) {

    request(opts, function(err, incoming, response) {
        var res = JSON.parse(response);
        if (err) {
            defer.reject(err);
            return;
        }
        if (res.errors) {
            defer.reject(new Error(res.errors[0].message));
            return;
        }
        if (res.message) {
            defer.reject(new Error(res.message));
            return;
        }
        console.info('Repository [' + answer.proName + '] is created!');
        var exec = new Executor(['git clone ' + res.ssh_url]);

        exec.start().then(function() {

            var scaffoldPath = path.join(__dirname, '../gapScaffold');

            var stream = gulp.src(scaffoldPath + '/**/*')
            .pipe(template(_.assign(answer, res)))
            .pipe(gulp.dest(answer.localPath));

            stream.on('close', defer.resolve);
            stream.on('finish', defer.resolve);
            stream.on('error', defer.reject);

        }, function(err) {
            defer.reject(err);
        });
    });

};

var Task = function() {

    this._id = 'CreatePro';
    this._desc = 'Create project on Github';
};

Task.prototype.start = function() {
    var d = Q.defer();

    inquirer.prompt([{
            type: 'input',
            name: 'username',
            message: 'Username or Email for Github',
            default: process.env.USERNAME
        }, {
            type: 'password',
            name: 'password',
            message: 'Password for Github',
            validate: function(pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'proName',
            message: 'Project name to be created',
            validate: function(pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'proDesc',
            message: 'Project description',
            validate: function(pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'proAuthor',
            message: 'Project Author\'s name',
            default: process.env.USERNAME,
            validate: function(pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'proEmail',
            message: 'Project Author\'s email',
            default: function(answer) {
                if (mail_reg.test(answer.username)) {
                    return answer.username;
                }
            },
            validate: function(pass) {
                return mail_reg.test(pass);
            }
        }, {
            type: 'input',
            name: 'proWebsite',
            message: 'Project Author\'s website',
            validate: function(pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'widgetId',
            message: 'Project\'s namespace',
            default: 'com.example',
            validate: function(pass) {
                var re = /^[a-z]+([.][a-z]+)+$/;
                return re.test(pass);
            }
        }, {
            type: 'checkbox',
            name: 'plugins',
            message: 'Project\'s plugins',
            default: 'com.example',
            choices: [
                {
                    name: 'Battery Status',
                    value: 'org.apache.cordova.battery-status',
                    checked: true
                }, {
                    name: 'Camera',
                    value: 'org.apache.cordova.camera',
                    checked: true
                }, {
                    name: 'Console',
                    value: 'org.apache.cordova.console',
                    checked: true
                }, {
                    name: 'Contacts',
                    value: 'org.apache.cordova.contacts',
                    checked: true
                }, {
                    name: 'Device',
                    value: 'org.apache.cordova.device',
                    checked: true
                }, {
                    name: 'Device Motion (Accelerometer)',
                    value: 'org.apache.cordova.device-motion',
                    checked: true
                }, {
                    name: 'Device Orientation (Compass)',
                    value: 'org.apache.cordova.device-orientation',
                    checked: true
                }, {
                    name: 'Dialogs',
                    value: 'org.apache.cordova.dialogs',
                    checked: true
                }, {
                    name: 'FileSystem',
                    value: 'org.apache.cordova.file',
                    checked: true
                }, {
                    name: 'File Transfer',
                    value: 'org.apache.cordova.file-transfer',
                    checked: true
                }, {
                    name: 'Geolocation',
                    value: 'org.apache.cordova.geolocation',
                    checked: true
                }, {
                    name: 'Globalization',
                    value: 'org.apache.cordova.globalization',
                    checked: true
                }, {
                    name: 'InAppBrowser',
                    value: 'org.apache.cordova.inappbrowser',
                    checked: true
                }, {
                    name: 'Media',
                    value: 'org.apache.cordova.media',
                    checked: true
                }, {
                    name: 'Media Capture',
                    value: 'org.apache.cordova.media-capture',
                    checked: true
                }, {
                    name: 'Network Information (Connection)',
                    value: 'org.apache.cordova.network-information',
                    checked: true
                }, {
                    name: 'Splashscreen',
                    value: 'org.apache.cordova.splashscreen',
                    checked: true
                }, {
                    name: 'Vibration',
                    value: 'org.apache.cordova.vibration',
                    checked: true
                }
            ]
        }], function(res) {
        var opts = _.clone(options);
        opts.auth.user = res.username;
        opts.auth.pass = res.password;
        opts.body.name = res.proName;
        opts.body.description = res.proDesc;
        opts.body = JSON.stringify(opts.body);

        res.localPath = path.join('.', res.proName);


        fs.exists(res.localPath, function(exists) {
            if (exists) {
                d.reject(new Error('The directory [' + res.proName + '] is already exist.'));
                return;
            }

            createRepo(opts, d, res);

        });

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
