#!/usr/bin/env node

'use strict';

var createMenu = require('terminal-menu');
var EventEmitter = require('events').EventEmitter;
var chalk = require('chalk');

var UT = require('./libs/Utils');
var utils = new UT();


var title = 'ANGAP SAVE YOU FROM COMPLICATED DEVELOPMENT WORKS';
var subtitle = 'Select an task and hit Enter to begin';

var defaultWith = 100;


var emitter = new EventEmitter();
var menu = createMenu({
    width: defaultWith,
    x: 3,
    y: 2
});

//clean up the terminal
menu.reset();
//display the title
menu.write(chalk.bold(title) + '\n');
//display the subtitle
menu.write(chalk.italic(subtitle) + '\n');
//display start separator
menu.write(utils.repeat('-', defaultWith) + '\n');

// opts.exercises.forEach(function(name) {
//     var isDone = opts.completed.indexOf(name) >= 0,
//         m = '[COMPLETED]'

//     name = name

//     if (isDone) {
//         menu.add(chalk.bold('»') + ' ' + name + util.repeat(' ', opts.width - m.length - name.length - 2) + m)
//     } else {
//         menu.add(chalk.bold('»') + ' ' + name + util.repeat(' ', opts.width - name.length - 2))
//     }
// })

//display end separator
menu.write(utils.repeat('-', defaultWith) + '\n');
//display help
menu.add(chalk.bold('HELP'));
//display exit
menu.add(chalk.bold('EXIT'));

menu.on('select', function(label) {
    var name = chalk.stripColor(label).replace(/(^»?\s+)/g, '');
    menu.y = 0;
    menu.reset();
    menu.close();

    if (name === 'EXIT') {
        emitter.emit('exit');
        menu.close();
        process.exit(0);
    }

    if (name === 'HELP') {
        return emitter.emit('help');
    }

    emitter.emit('select', name);
});

menu.createStream().pipe(process.stdout);