'use strict';
var TaskRunner = require('terminal-task-runner');
var Base = TaskRunner.Base;
var logger = TaskRunner.logger;

var isInt = function(val) {
    return !isNaN(parseInt(val));
};

var Task = Base.extend({
    id: 'WebServiceSimulator',
    name: 'Launch web service simulator',
    position: 6,
    command: 'simulator',
    options: [{
        flags: '-p, --port <port>',
        description: 'specify the port of the static webserver'
    }, {
        flags: '-r, --routerDir <routerDir>',
        description: 'specify the less paths'
    }],
    check: function(cmd) {
        return cmd.port && cmd.routerDir;
    },
    run: function(cons) {

        var _this = this;
        var path = require('path');
        var fs = require('fs');

        this.prompt([{
            type: 'input',
            name: 'port',
            message: 'Port the simualtor would listen on',
            default: _this.get('simulatorPort', 3000),
            validate: function(pass) {
                return isInt(pass);
            }
        }, {
            type: 'input',
            name: 'routerDir',
            message: 'Specify the routerDir',
            default: _this.get('simulatorRouterDir', './routers'),
            validate: function(pass) {
                return fs.existsSync(path.resolve('.', pass)) ? true : 'routerDir must exist';
            }
        }], function(answer) {

            _this.action(answer, cons);

        });

    },
    action: function(answer, cons) {
        var path = require('path');
        var fs = require('fs');

        if (!isInt(answer.port)) {
            cons('port must be int');
            return;
        }
        if (!fs.existsSync(path.resolve('.', answer.routerDir))) {
            cons('routerDir must exist');
            return;
        }
        var _this = this;
        var Simulator = require('webservice-simulator');


        _this.put({
            simulatorPort: answer.port,
            simulatorRouterDir: answer.routerDir
        });
        new Simulator({
            port: answer.port,
            routerDir: path.resolve('.', answer.routerDir)
        }).start();
    }
});


module.exports = Task;
