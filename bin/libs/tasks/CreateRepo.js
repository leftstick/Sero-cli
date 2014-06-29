const Q = require('q');
const inquirer = require('inquirer');
const request = require('request');
const _ = require('lodash');
const Executor = require('../CmdExecutor');
const path = require('path');
const fs = require('fs');

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
        'auto_init': true,
        'license_template': 'mit'
    }
};

var createRepo = function(opts, defer, repoName) {

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
        console.info('Repository [' + repoName + '] is created!');
        var exec = new Executor([{
            cmd: 'git',
            args: ['clone', res.ssh_url]
        }]);

        exec.start().then(function() {
            defer.resolve();
        }, function(err) {
            defer.reject(err);
        });
    });

};

var Task = function() {

    this._id = 'CreateRepo';
    this._desc = 'Create repository on Github';
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
        name: 'repoName',
        message: 'Repository name to be created',
        validate: function(pass) {
            return !!pass;
        }
    }], function(res) {
        var opts = _.clone(options);
        opts.auth.user = res.username;
        opts.auth.pass = res.password;
        opts.body.name = res.repoName;
        opts.body = JSON.stringify(opts.body);


        fs.exists(path.join('.', res.repoName), function(exists) {
            if (exists) {
                d.reject(new Error('The directory [' + res.repoName + '] is already exist.'));
                return;
            }

            createRepo(opts, d, res.repoName);

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
