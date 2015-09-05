var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-spawn-mocha');
var webpack = require('webpack');
var electron = require('electron-prebuilt');
var spawn = require('child_process').spawn;
var stdio = require('stdio');
var del = require('del');
var assign = Object.assign || require('object-assign');

var options = stdio.getopt({
    'watch': { key: 'w', description: 'Watch changes', 'default': false }
});

var paths = {
    dest: './dist',
    html: './app/view/index.html',
    main: './app/core/main.js'
};

gulp.task('clear', function (callback) {
    del([paths.dest], callback);
});

gulp.task('html', ['clear'], function () {
    return gulp.src([paths.html])
        .pipe(gulp.dest(paths.dest));
});

var scriptsCallbackCalled = false;

gulp.task('scripts', ['clear'], function(callback) {
    var config = require('./webpack.config');

    if (options.watch) {
        config = assign(config, { watch: true });
    }

    return webpack(config, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString());
        if (!scriptsCallbackCalled) {
            scriptsCallbackCalled = true;
            callback();
        }
    });
});

gulp.task('main', ['clear'], function () {
    return gulp.src([paths.main])
        .pipe(gulp.dest(paths.dest));
});

gulp.task('run', ['html', 'scripts', 'main'], function() {
    spawn(electron, ['.'], { stdio: 'inherit' });
});

gulp.task('test', function () {
    return gulp.src(['test/**/*.test.js'], { read: false })
        .pipe(mocha({
            compilers: 'js:babel/register',
            reporter: 'dot',
            require: 'test/setup.js'
        }));
});