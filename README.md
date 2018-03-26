Sero-cli
=========

[![NPM version][npm-image]][npm-url]
![][david-url]
![][travis-url]
![][dt-url]
![][license-url]

> The web application development toolkit



# the repo is not maintained anymore, please refer to other alternatives, Thanks #




![](https://raw.githubusercontent.com/leftstick/Sero-cli/master/docs/img/example.png)

Sero-cli provides a friendly interactive interface to help developers start developing web application on `Github`. All you need to do is pressing [KEY_UP]/[KEY_DOWN] to navigate the specific task you'd like to execute.

## Background knowledge ##
Following technologies are recommended to know before starting use it.

> [Nodejs](http://www.nodejs.org/) is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications<br/>
> [NPM](http://www.npmjs.org/) is the official package manager for `Node.js`<br/>
> [bower](http://bower.io/) works by fetching and installing packages from all over, taking care of hunting, finding, downloading, and saving the stuff you’re looking for<br/>

## Installation ##

```shell
npm install sero-cli -g
```

## Basic Usage ##

Move to whatever the location you want to work in.

```shell
sero
```

## Advanced Usage ##

Advanced user may love specifying the task directly without choosing them from UI. We provide the command line to achieve this.


```shell
sero [command] [options]
```

For example:

```shell
sero git -u testuser -e test@gmail.com
```

> Above command is equivalent to `Configure git options for current working directory`

User `sero --help` to check the usage for each task

## Available Tasks ##

- [Configure git options for current working directory](./docs/task_gitconf.md)
- [Start a static web server for current working directory](./docs/task_startwebserver.md)
- [Create a brand new repository on Github](./docs/task_createRepo.md)
- [Launch web service simulator](./docs/task_startwebservicesimulator.md)
- [Build Javascripts into one 'main.js'](./docs/build.md)

## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/Sero-cli/master/LICENSE)

[npm-url]: https://npmjs.org/package/sero-cli
[npm-image]: https://badge.fury.io/js/sero-cli.png
[david-url]: https://david-dm.org/leftstick/sero-cli.png
[travis-url]: https://api.travis-ci.org/leftstick/Sero-cli.svg?branch=master
[dt-url]:https://img.shields.io/npm/dt/sero-cli.svg
[license-url]:https://img.shields.io/npm/l/sero-cli.svg
