const Q = require('q');
const spawn = require('child_process').spawn;
const _ = require('lodash');


var Executor = function(cmds, variables) {
    var source = cmds.slice();
    this.commands = cmds.slice();

    if (!_.isArray(this.commands)) {
        throw new Error('Commands has to be an array');
    }

    if (variables) {
        this.commands = [];
        var cmd;
        var c;
        var varHandler = function(arg) {
            this.push(_.template(arg, variables));
        };
        while (source.length > 0) {
            cmd = source.shift();

            c = {};
            c.cmd = cmd.cmd;
            c.args = [];
            c.outself = cmd.outself;
            c.outFilter = cmd.outFilter;

            _.each(cmd.args, varHandler, c.args);

            this.commands.push(c);
        }
    }
    this._run = function(defer) {
        var _this = this;
        if (!this.hasNext()) {
            defer.resolve();
            return;
        }

        this.next().then(function() {
            _this._run(defer);
        }, function(err) {
            defer.reject(err);
        });
    };

};


Executor.prototype.hasNext = function() {
    return this.commands.length > 0;
};

Executor.prototype.next = function() {
    var cmd = this.commands.shift();
    var d = Q.defer();

    var cp = spawn(cmd.cmd, cmd.args);

    cp.stdout.on('data', function(data) {
        var d = data;
        if (typeof data !== 'string') {
            d = data.toString('utf8');
        }
        if (!cmd.outFilter) {
            console.info(d);
            return;
        }

        if (!cmd.outFilter(d)) {
            return;
        }
        console.info(d);
    });

    cp.stderr.on('data', function(data) {
        var d = data;
        if (typeof data !== 'string') {
            d = data.toString('utf8');
        }
        if (!cmd.outFilter) {
            console.info(d);
            return;
        }

        if (!cmd.outFilter(d)) {
            return;
        }
        console.info(d);
    });

    cp.on('close', function(code) {
        if (cmd.outself) {
            console.info(cmd.cmd, cmd.args.join(' '));
        }
        d.resolve();
    });

    cp.on('exit', function(code) {
        if (cmd.outself) {
            console.info(cmd.cmd, cmd.args.join(' '));
        }
        d.resolve();
    });

    cp.on('error', function(err) {
        d.reject(err);
    });

    return d.promise;
};

Executor.prototype.start = function() {
    var d = Q.defer();

    this._run(d);

    return d.promise;
};

/**
 *
 * @param cmds(array) consist of cmd
 *
 * cmd : {
 *           cmd: 'git'
 *           args: [opts1, opts2, opts3...]
 *       }
 *
 **/
module.exports = Executor;
