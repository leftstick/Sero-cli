module.exports = function() {

    var colors = require('colors');

    colors.setTheme({
        info: 'grey',
        success: 'green',
        warn: 'yellow',
        error: 'red'
    });

    console.info = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        console.log(args.join(' ').info);
    };

    console.success = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        console.log(args.join(' ').success);
    };

    console.warn = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        console.log(args.join(' ').replace('Error:', 'Warn:').warn);
    };

    console.error = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        console.log(args.join(' ').error);
    };

};
