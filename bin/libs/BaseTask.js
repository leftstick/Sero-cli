var extend = require('class-extend').extend;
var utils = require('./Utils');

var checkOpts = function (obj, key) {
    if (typeof obj[key] === 'string' && obj[key].trim() === '') {
        throw new Error('[' + key + '] must be overwritten in [' + obj.path + '] Task');
    }
    if (typeof obj[key] === 'number' && obj[key] === 0) {
        throw new Error('[' + key + '] must be overwritten in [' + obj.path + '] Task');
    }
};

var BaseTask = function (path) {
    this.path = path;
    this.validateMandatory();
};

BaseTask.prototype.id = '';

BaseTask.prototype.name = '';

BaseTask.prototype.priority = 0;

BaseTask.prototype.validateMandatory = function () {
    checkOpts(this, 'id');
    checkOpts(this, 'name');
    checkOpts(this, 'priority');
};

BaseTask.prototype.run = function (cons) {
    //needs to be implemented in subclass
};

BaseTask.extend = extend;

module.exports = BaseTask;