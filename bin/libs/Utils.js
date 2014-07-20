var path = require('path');
var chalk = require('chalk');
var os = require('os');
var colorsTmpl = require('colors-tmpl');
var fs = require('fs');

var binDir = path.join(__dirname, '../', '../', 'bin');
var isWin = os.platform().indexOf('win') > -1;

var Utils = {
    binDir: binDir,
    taskDir: path.join(binDir, 'tasks'),
    isWindows: isWin,
    separator: isWin ? '\\' : '/',
    joinBinPath: function (filePath) {
        var p = filePath.replace(/\//g, this.separator);
        return path.join(binDir, p);
    },
    joinWorkingPath: function (filePath) {
        var p = filePath.replace(/\//g, this.separator);
        return path.join('.', p);
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
    },
    printFile: function (filePath) {
        var contents;
        try {
            contents = fs.readFileSync(this.convertPath(filePath), {
                encoding: 'utf8'
            });

            contents = colorsTmpl(contents);

            console.log(contents);
        } catch (e) {
            throw e;
        }

    }
};


module.exports = Utils;