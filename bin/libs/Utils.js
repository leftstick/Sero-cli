var path = require('path');

var binDir = path.join(__dirname, '../', '../', 'bin');
var Utils = {
    binDir: binDir,
    taskDir: path.join(binDir, 'tasks'),
    dirFromName: function(name) {
        return path.join(this.taskDir, this.idFromName(name));
    },
    idFromName: function(id) {
        return id.toLowerCase().replace(/\s/g, '_').replace(/[^\w]/gi, '');
    },
    repeat: function(ch, sz) {
        return new Array(sz + 1).join(ch);
    },
};


module.exports = Utils;