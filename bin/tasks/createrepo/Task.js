'use strict';

var TaskRunner = require('terminal-task-runner');
var Shell = TaskRunner.shell;
var Base = TaskRunner.Base;
var logger = TaskRunner.logger;


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


var Task = Base.extend({
    id: 'CreateGitRepo',
    name: 'Create a brand new repository on Github',
    command: 'create',
    options: [
        {
            flags: '-u, --username <username>',
            description: 'specify the user name'
        },
        {
            flags: '-p, --password <password>',
            description: 'specify the password'
        },
        {
            flags: '-n, --project <project name>',
            description: 'specify the project name'
        },
        {
            flags: '-d, --desc <project description>',
            description: 'specify the project description'
        }
    ],
    check: function(cmd) {
        return cmd.username && cmd.password && cmd.project && cmd.desc;
    },
    run: function(cons) {

        var _this = this;

        this.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Username or Email for Github',
                default: _this.get('githubaccount', process.env.USERNAME)
            },
            {
                type: 'password',
                name: 'password',
                message: 'Password for Github',
                validate: function(pass) {
                    return !!pass;
                }
            },
            {
                type: 'input',
                name: 'project',
                message: 'Project name to be created',
                validate: function(pass) {
                    return !!pass;
                }
            },
            {
                type: 'input',
                name: 'desc',
                message: 'Project description'
            }
        ], function(answer) {
            _this.action(answer, cons);
        });

    },
    action: function(answer, cons) {
        var _this = this;
        var fs = require('fs');
        var path = require('path');
        var request = require('request');
        options.auth.user = answer.username;
        options.auth.pass = answer.password;
        options.body.name = answer.project;
        options.body.description = answer.desc;
        options.body = JSON.stringify(options.body);

        answer.localPath = path.join('.', answer.project);
        _this.put({githubaccount: answer.username});


        fs.exists(answer.localPath, function(exists) {
            if (exists) {
                cons('The directory [' + answer.project + '] is already exist.');
                return;
            }

            request(options, function(err, incoming, response) {
                var res = JSON.parse(response);
                if (err) {
                    cons(err);
                    return;
                }
                if (res.errors) {
                    cons(res.errors[0].message);
                    return;
                }
                if (res.message) {
                    cons(res.message);
                    return;
                }
                logger.success('Repository [' + answer.project + '] is created!');

                var exec = new Shell(['git clone ' + res.ssh_url]);

                exec.start().then(function() {
                    cons();
                    return;
                }, function(err) {
                    cons(err);
                    return;
                });
            });

        });
    }
});


module.exports = Task;
