#!/usr/bin/env node

'use strict';

var _ = require('lodash');
var createMenu = require('terminal-menu');
var EventEmitter = require('events').EventEmitter;
var chalk = require('chalk');

var TaskManager = require('./libs/TaskManager');
var utils = require('./libs/Utils');


var title = 'ANGAP SAVE YOU FROM COMPLICATED DEVELOPMENT WORKS';
var subtitle = 'Select an task and hit Enter to begin';

var defaultWith = 100;


var taskMgr = new TaskManager();

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

_.each(taskMgr.getTaskList(), function(task){
    menu.add(chalk.bold('»') + ' ' + task.getName() + utils.repeat(' ', defaultWith - task.getName().length - 1), function(){
        taskMgr.run(task.getId()).on('finish', function(){
            console.log('finish ed asdfasdfadf');
        });
    });
});

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