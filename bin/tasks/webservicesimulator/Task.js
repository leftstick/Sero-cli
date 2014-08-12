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
    run: function(cons) {

        var fs = require('fs');
        var path = require('path');
        var Simulator = require('webservice-simulator');

        var _this = this;

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

                _this.put({
                    simulatorPort: answer.port,
                    simulatorRouterDir: answer.routerDir
                });
                new Simulator({
                    port: answer.port,
                    routerDir: path.resolve('.', answer.routerDir)
                }).start();


            });

    }
});


module.exports = Task;