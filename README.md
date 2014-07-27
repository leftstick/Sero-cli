Sero-cli
=========

![](http://img.shields.io/badge/npm_module-v1.0.9-green.svg?style=flat)  ![](http://img.shields.io/badge/dependencies-latest-yellowgreen.svg?style=flat)
![](http://img.shields.io/badge/build-passing-brightgreen.svg?style=flat)

> The web application development toolkit


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

## Usage ##

Move to whatever the location you want to work in. 

```shell
sero
```

## Available Tasks ##

- [Configure git options for current working directory](./docs/task_gitconf.md)
- [Install npm dependencies](./docs/task_installnpm.md)
- [Install bower dependencies](./docs/task_installbower.md)
- [Start a static web server for current working directory](./docs/task_startwebserver.md)
- [Create a brand new repository on Github](./docs/task_createrepo.md)

## LICENSE ##

[MIT License](http://en.wikipedia.org/wiki/MIT_License)