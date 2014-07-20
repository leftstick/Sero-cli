var path = require('path');
var chalk = require('chalk');
var os = require('os');

var binDir = path.join(__dirname, '../', '../', 'bin');
var isWin = os.platform().indexOf('win') > -1;

var Utils = {
    binDir: binDir,
    taskDir: path.join(binDir, 'tasks'),
    isWindows: isWin,
    separator: isWin ? '\\' : ' / ',
    dirFromName: function (name) {
        return path.join(this.taskDir, this.idFromName(name));
    },
    idFromName: function (id) {
        return id.toLowerCase().replace(/\s/g, '_').replace(/[^\w]/gi, '');
    },
    repeat: function (ch, sz) {
        return new Array(sz + 1).join(ch);
    },
    convertPath: function (path) {
        var p = path;
        if (isWin) {
            p = p.replace(/\\/g, '\\\\');
        }
        return p;
    },
    logger: {
        success: function () {
            var args = Array.prototype.slice.call(arguments);
            console.log(chalk.green.apply(undefined, args));
        },
        info: function () {
            var args = Array.prototype.slice.call(arguments);
            console.log(chalk.white.apply(undefined, args));
        },
        warn: function () {
            var args = Array.prototype.slice.call(arguments);
            console.log(chalk.yellow.apply(undefined, args));
        },
        error: function () {
            var args = Array.prototype.slice.call(arguments);
            console.log(chalk.red.apply(undefined, args));
        }
    }
};


module.exports = Utils;