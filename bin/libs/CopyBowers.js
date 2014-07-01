const Q = require('q');
const gulp = require('gulp');
const rename = require('gulp-rename');
const _ = require('lodash');
const path = require('path');
var es = require('event-stream');

const www = './www';
const bowerPath = './bower_components';

var getDepencyArr = function(dependencyDefine, category) {
    var arr = [];
    _.each(dependencyDefine, function(dependency, key) {
        if (!dependency[category]) {
            return;
        }
        if (!_.isArray(dependency[category])) {
            console.warn('dependencyDefine.' + key + '.' + category + ' must be array');
            return;
        }
        if (dependency[category].length > 0) {
            _.each(dependency[category], function(jsFile) {
                arr.push(bowerPath + jsFile);
            });
        }
    });
    return arr;
};

var prepareJsMock = function(type) {
    var stream;
    if (type === 'debug') {
        stream = gulp.src([
            path.resolve(__dirname, './mock/cordova.js')
        ])
        .pipe(gulp.dest(www));
    } else {
        stream = gulp.src([
            www + '/cordova.js'
        ], {
            read: false
        })
        .pipe(clean());
    }

    return stream;
};

var prepareJsLib = function(dependencyDefine) {
    var jsArr = getDepencyArr('js');

    return gulp.src(jsArr)
    .pipe(rename(function(path) {
        var index = path.basename.indexOf('.min');
        if (index > -1) {
            path.basename = path.basename.substring(0, index);
        }
    }))
    .pipe(gulp.dest(www + '/js/libs/'));
};

var prepareMapLib = function(dependencyDefine) {
    var mapArr = getDepencyArr('map');

    return gulp.src(mapArr)
    .pipe(gulp.dest(www + '/js/libs/'));
};

var prepareCssLib = function(dependencyDefine) {
    var cssArr = getDepencyArr('css');

    return gulp.src(cssArr)
    .pipe(rename(function(path) {
        var index = path.basename.indexOf('.min');
        if (index > -1) {
            path.basename = path.basename.substring(0, index);
        }
    }))
    .pipe(gulp.dest(www + '/css/'));
};


var prepareImgLib = function(dependencyDefine) {
    var imgArr = getDepencyArr('img');

    return gulp.src(imgArr)
    .pipe(gulp.dest(www + '/img/'));
};

var prepareFontLib = function(dependencyDefine) {
    var fontArr = getDepencyArr('font');

    return gulp.src(fontArr)
    .pipe(gulp.dest(www + '/font/'));
};


var CopyBower = function(type) {
    this.type = type || 'debug';
};

CopyBower.prototype.start = function() {
    var d = Q.defer();

    var streams = [];

    streams.push(prepareJsMock(this.type));

    var bower = require(path.resolve('.', 'bower.json'));

    if (!bower.dependencyDefine) {
        console.warn('No dependencyDefine property in bower.json');
    } else {
        streams.push(prepareJsLib(bower.dependencyDefine));
        streams.push(prepareMapMock(bower.dependencyDefine));
        streams.push(prepareCssMock(bower.dependencyDefine));
        streams.push(prepareImgMock(bower.dependencyDefine));
        streams.push(prepareFontMock(bower.dependencyDefine));
    }

    var oneStream = es.merge.apply(null, streams);


    oneStream.on('end', function() {
        d.resolve();
    });

    oneStream.on('finish', function() {
        d.resolve();
    });

    oneStream.on('error', function(err) {
        d.reject(err);
    });

    return d.promise;
};


module.exports = CopyBower;