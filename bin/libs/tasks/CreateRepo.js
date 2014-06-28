const Q = require('q');

var Task = function() {

    this._id = 'CreateRepo';
    this._desc = 'Create repository on Github';
};

Task.prototype.start = function() {
    var d = Q.defer();
    console.log(this._desc);
    d.resolve();

    return d.promise;
};

Task.prototype.getID = function() {
    return this._id;
};

Task.prototype.getDesc = function() {
    return this._desc;
};

module.exports = Task;
