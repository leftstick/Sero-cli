#!/usr/bin/env node

'use strict';

var _ = require('lodash');
var createMenu = require('terminal-menu');
var chalk = require('chalk');

var TaskManager = require('./libs/TaskManager');
var utils = require('./libs/Utils');
var logger = utils.logger;


var title = 'ANGAP SAVE YOU FROM COMPLICATED DEVELOPMENT WORKS';
var subtitle = 'Select an task and hit Enter to begin';

var defaultWith = 100;


var exit = function (code) {
    process.exit(code);
};


var taskMgr = new TaskManager();

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


taskMgr.getTaskList().forEach(function (task, index, tasklist) {
    menu.add(chalk.bold('»') + ' ' + task.name + utils.repeat(' ', defaultWith - task.name.length - 1));
});

//display end separator
menu.write(utils.repeat('-', defaultWith) + '\n');
//display usage
menu.add(chalk.bold('USAGE'));
//display help
menu.add(chalk.bold('HELP'));
//display exit
menu.add(chalk.bold('EXIT'));

menu.on('select', function (label, index) {
    var name = chalk.stripColor(label).replace(/(^»?\s+)/g, '');

    menu.y = 0;
    menu.reset();
    menu.close();

    if (name === 'EXIT') {
        exit(0);
        return;
    }

    if (name === 'HELP') {
        utils.printFile(utils.joinBinPath('help.txt'));
        exit(0);
        return;
    }

    if (name === 'USAGE') {
        utils.printFile(utils.joinBinPath('usage.txt'));
        exit(0);
        return;
    }

    var task = taskMgr.getTaskByIndex(index);

    var runner = taskMgr.run(task.id);

    runner.on('finish', function () {
        logger.success('finish: ', task.name);
        exit(0);
    });

    runner.on('error', function (err) {
        logger.error('failed: ', err);
        exit(0);
    });

});

menu.createStream().pipe(process.stdout);