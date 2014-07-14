var extend = require('class-extend').extend;

var checkOpts = function(opts, key) {
    if (!_.has(opts, key)) {
        throw new Error('[' + key + '] must be set in opts');
    }
};

var BaseTask = function(opts) {
    this.id = '';
    this.name = '';
    this.priority = 0;
    if (opts) {
        checkOpts(opts, 'id');
        checkOpts(opts, 'name');
        checkOpts(opts, 'priority');

        this.id = opts.id;
        this.name = opts.name;
        this.priority = opts.priority;
    }
};

BaseTask.prototype.getId = function() {
    return this.id;
};

BaseTask.prototype.getName = function() {
    return this.name;
};

BaseTask.prototype.getPriority = function() {
    return this.priority;
};

BaseTask.prototype.run = function(cons) {
    //needs to be implemented in subclass
};

BaseTask.extend = extend;

module.exports = BaseTask;