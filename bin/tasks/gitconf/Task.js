
var TaskRunner = require('terminal-task-runner');
var Shell = TaskRunner.shell;
var Base = TaskRunner.Base;

var configs = [
    'git config --local user.name <%= username %>',
    'git config --local user.email <%= useremail %>',
    'git config --local core.excludesfile $HOME/.gitignore',
    'git config --local core.autocrlf input',
    'git config --local color.ui true',
    'git config --local gui.encoding utf-8',
    'git config --local push.default tracking',
    'git config --local branch.autosetupmerge always',
    'git config --local branch.autosetuprebase always',
    'git config --local alias.co checkout',
    'git config --local alias.st status',
    'git config --local alias.br branch'
];


var Task = Base.extend({
    id: 'GitConfig',
    name: 'Configure git options for current working directory',
    position: 1,
    run: function(cons) {

        var fs = require('fs');
        var _this = this;

        fs.stat('.git', function(err, stats) {
            var error = 'The working directory must be a valid git project.';
            if (err) {
                cons(error);
                return;
            }

            if (!stats.isDirectory()) {
                cons(error);
                return;
            }


            _this.prompt([{
                type: 'input',
                name: 'username',
                message: 'your name:',
                default: _this.get('username', process.env.USERNAME)
                }, {
                type: 'input',
                name: 'useremail',
                message: 'your email:',
                default: _this.get('useremail') ? _this.get('useremail') : undefined,
                validate: function(pass) {
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(pass);
                }
            }], function(res) {

                    _this.put({
                        username: res.username,
                        useremail: res.useremail
                    });

                    var exec = new Shell(configs, res);
                    exec.start().then(function() {
                        cons();
                    }, function(err) {
                            cons(err);
                        });

                });


        });

    }
});


module.exports = Task;