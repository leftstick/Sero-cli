var inquirer = require('inquirer');
var fs = require('fs');
var request = require('request');
var Executor = require('../../libs/CmdExecutor');
var BaseTask = require('../../libs/BaseTask');
var utils = require('../../libs/Utils');
var logger = utils.logger;

var MAIL_REG = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


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


var Task = BaseTask.extend({
    id: 'CreateGitRepo',
    name: 'Create a brand new repository on Github',
    priority: 4,
    run: function (cons) {

        inquirer.prompt([{
            type: 'input',
            name: 'username',
            message: 'Username or Email for Github',
            default: process.env.USERNAME
        }, {
            type: 'password',
            name: 'password',
            message: 'Password for Github',
            validate: function (pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'proName',
            message: 'Project name to be created',
            validate: function (pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'proDesc',
            message: 'Project description'
        }, {
            type: 'input',
            name: 'proAuthor',
            message: 'Project Author\'s name',
            default: function (answer) {
                if (!MAIL_REG.test(answer.username)) {
                    return answer.username;
                }
                return answer.username.substring(0, answer.username.indexOf('@'));
            },
            validate: function (pass) {
                return !!pass;
            }
        }, {
            type: 'input',
            name: 'proEmail',
            message: 'Project Author\'s email',
            default: function (answer) {
                if (MAIL_REG.test(answer.username)) {
                    return answer.username;
                }
            },
            validate: function (pass) {
                return MAIL_REG.test(pass);
            }
        }], function (answer) {
            options.auth.user = answer.username;
            options.auth.pass = answer.password;
            options.body.name = answer.proName;
            options.body.description = answer.proDesc;
            options.body = JSON.stringify(options.body);

            answer.localPath = utils.joinWorkingPath(answer.proName);


            fs.exists(answer.localPath, function (exists) {
                if (exists) {
                    cons('The directory [' + answer.proName + '] is already exist.');
                    return;
                }

                request(options, function (err, incoming, response) {
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
                    logger.success('Repository [' + answer.proName + '] is created!');

                    var exec = new Executor(['git clone ' + res.ssh_url]);

                    exec.start().then(function () {
                        cons();
                        return;
                    }, function (err) {
                        cons(err);
                        return;
                    });
                });

            });

        });


    }
});


module.exports = Task;