'use strict';

var path = require('path');

var Utils = function() {
    this.taskDir = path.join(__dirname, '../', 'tasks');
};

Utils.prototype.dirFromName = function(name) {
    return path.join(this.taskDir, this.idFromName(name));
};


Utils.prototype.idFromName = function(id) {
    return id.toLowerCase().replace(/\s/g, '_').replace(/[^\w]/gi, '');
};


Utils.prototype.repeat = function(ch, sz) {
    return new Array(sz + 1).join(ch);
};


module.exports = Utils;